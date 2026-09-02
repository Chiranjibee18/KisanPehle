-- =================================================================
-- Kisan Pehele — Supabase PostgreSQL Schema & Row Level Security (RLS)
-- "Pehle Pata, Phir Mandi."
-- =================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES (Linked to Supabase auth.users.id)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'FARMER' CHECK (role IN ('FARMER', 'OFFICER', 'DISTRICT_ADMIN', 'STATE_ADMIN', 'AUDITOR', 'TRUSTED_HELPER')),
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'hi',
    district VARCHAR(100) NOT NULL DEFAULT 'Balasore',
    state VARCHAR(100) NOT NULL DEFAULT 'Odisha',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. FARMER PROFILES (With AES-256-GCM encrypted sensitive fields)
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farmer_reference_id VARCHAR(50) UNIQUE NOT NULL,
    land_holding_acres NUMERIC(6, 2) NOT NULL DEFAULT 2.50,
    village VARCHAR(100) NOT NULL DEFAULT 'Kalyanpur',
    pincode VARCHAR(10) NOT NULL DEFAULT '756001',
    -- AES-256-GCM Encrypted Sensitive Fields (Stored as ciphertext, IV, and GCM auth tag)
    encrypted_kcc TEXT,
    encrypted_kcc_iv VARCHAR(32),
    encrypted_kcc_tag VARCHAR(32),
    encrypted_aadhaar_ref TEXT,
    encrypted_aadhaar_iv VARCHAR(32),
    encrypted_aadhaar_tag VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROCUREMENT CENTRES
CREATE TABLE IF NOT EXISTS public.procurement_centres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centre_code VARCHAR(30) UNIQUE NOT NULL,
    centre_name VARCHAR(150) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL DEFAULT 21.4934,
    longitude NUMERIC(9, 6) NOT NULL DEFAULT 86.9135,
    operating_hours VARCHAR(50) NOT NULL DEFAULT '08:00 AM - 05:00 PM',
    daily_capacity NUMERIC(10, 2) NOT NULL DEFAULT 500.0,
    current_status VARCHAR(30) NOT NULL DEFAULT 'OPEN' CHECK (current_status IN ('OPEN', 'BUSY', 'FULL', 'CLOSED', 'TEMPORARILY_UNAVAILABLE', 'ACTIVE', 'LIMITED_CAPACITY')),
    status_reason TEXT,
    active_counters INT NOT NULL DEFAULT 3,
    contact_information VARCHAR(100) NOT NULL DEFAULT '+91 6782-262100',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CENTRE STAFF (Officer assignments)
CREATE TABLE IF NOT EXISTS public.centre_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centre_id UUID NOT NULL REFERENCES public.procurement_centres(id) ON DELETE CASCADE,
    officer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    designation VARCHAR(100) NOT NULL DEFAULT 'Procurement Officer',
    assigned_counter INT DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(centre_id, officer_profile_id)
);

-- 5. SLOTS (With atomic capacity enforcement)
CREATE TABLE IF NOT EXISTS public.slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centre_id UUID NOT NULL REFERENCES public.procurement_centres(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INT NOT NULL DEFAULT 20,
    booked_count INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'FULL', 'CANCELLED', 'COMPLETED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT slot_capacity_not_exceeded CHECK (booked_count <= capacity),
    UNIQUE(centre_id, slot_date, start_time)
);

-- 6. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    idempotency_key VARCHAR(100) UNIQUE,
    farmer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    centre_id UUID NOT NULL REFERENCES public.procurement_centres(id) ON DELETE CASCADE,
    slot_id UUID NOT NULL REFERENCES public.slots(id) ON DELETE RESTRICT,
    crop_name VARCHAR(100) NOT NULL DEFAULT 'Paddy (Common)',
    estimated_quantity_quintals NUMERIC(8, 2) NOT NULL DEFAULT 20.0,
    vehicle_type VARCHAR(50) NOT NULL DEFAULT 'TRACTOR_TROLLEY',
    vehicle_number VARCHAR(30) NOT NULL DEFAULT 'OD-01-AB-1234',
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELLED', 'RESCHEDULED', 'COMPLETED', 'NO_SHOW')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DIGITAL QUEUE TOKENS
CREATE TABLE IF NOT EXISTS public.queue_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_number VARCHAR(30) NOT NULL, -- e.g. "A-142" or "KP-142"
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    farmer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    centre_id UUID NOT NULL REFERENCES public.procurement_centres(id) ON DELETE CASCADE,
    queue_position INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'CALLED', 'IN_PROGRESS', 'SERVING', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    recommended_arrival VARCHAR(50) NOT NULL DEFAULT '08:45 AM',
    estimated_wait_minutes INT NOT NULL DEFAULT 25,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    called_at TIMESTAMPTZ,
    serving_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. LIVE QUEUE STATUS (Authoritative Single Source of Truth)
CREATE TABLE IF NOT EXISTS public.queue_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centre_id UUID UNIQUE NOT NULL REFERENCES public.procurement_centres(id) ON DELETE CASCADE,
    current_serving_token VARCHAR(30),
    total_tokens_issued INT NOT NULL DEFAULT 0,
    waiting_in_queue INT NOT NULL DEFAULT 0,
    active_counters INT NOT NULL DEFAULT 3,
    estimated_wait_time_minutes INT NOT NULL DEFAULT 15,
    last_advanced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. PROCUREMENT RECORDS (Quality Inspection & Weighment)
CREATE TABLE IF NOT EXISTS public.procurement_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    farmer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    centre_id UUID NOT NULL REFERENCES public.procurement_centres(id) ON DELETE CASCADE,
    officer_profile_id UUID REFERENCES public.profiles(id),
    current_status VARCHAR(40) NOT NULL DEFAULT 'SCHEDULED' CHECK (current_status IN ('REGISTERED', 'SCHEDULED', 'ARRIVED', 'VERIFICATION', 'INSPECTION', 'ACCEPTED', 'REJECTED', 'PROCUREMENT_COMPLETED', 'PAYMENT_PROCESSING', 'PAID', 'PAYMENT_FAILED')),
    measured_moisture_percent NUMERIC(5, 2),
    foreign_matter_percent NUMERIC(5, 2),
    quality_grade VARCHAR(30),
    weighed_quantity_quintals NUMERIC(8, 2),
    net_procured_quantity_quintals NUMERIC(8, 2),
    rejection_reason TEXT,
    inspection_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PAYMENT RECORDS (PFMS DBT Tracking — No Banking Secrets)
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procurement_record_id UUID UNIQUE NOT NULL REFERENCES public.procurement_records(id) ON DELETE CASCADE,
    msp_rate_per_quintal NUMERIC(8, 2) NOT NULL,
    gross_amount_rupees NUMERIC(10, 2) NOT NULL,
    deductions_rupees NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    net_payable_rupees NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PROCESSING' CHECK (payment_status IN ('PENDING', 'PROCESSING', 'PAID', 'FAILED')),
    transaction_reference VARCHAR(100) UNIQUE,
    bank_account_masked VARCHAR(30), -- e.g. "XXXX-XXXX-4192"
    ifsc_masked VARCHAR(20),          -- e.g. "SBIN0001234"
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL DEFAULT 'SMS' CHECK (channel IN ('SMS', 'IN_APP', 'VOICE_IVR')),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'hi',
    delivery_status VARCHAR(30) NOT NULL DEFAULT 'DELIVERED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. IMMUTABLE STATUTORY AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    actor_role VARCHAR(30) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    reason TEXT,
    ip_address VARCHAR(50),
    cryptographic_hash VARCHAR(100) NOT NULL DEFAULT encode(sha256(gen_random_bytes(32)), 'hex'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. TRUSTED HELPERS
CREATE TABLE IF NOT EXISTS public.trusted_helpers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    helper_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL DEFAULT 'Family Member',
    permissions VARCHAR(50) NOT NULL DEFAULT 'VIEW_BOOK_AND_TRACK',
    consent_given BOOLEAN NOT NULL DEFAULT true,
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    UNIQUE(farmer_profile_id, helper_profile_id)
);

-- =================================================================
-- ROW LEVEL SECURITY (RLS) ENFORCEMENT
-- =================================================================

-- Enable RLS on all user-facing tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centre_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_helpers ENABLE ROW LEVEL SECURITY;

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('DISTRICT_ADMIN', 'STATE_ADMIN', 'AUDITOR')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: get user's profile id
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM public.profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: check if current user is officer at given centre
CREATE OR REPLACE FUNCTION public.is_officer_at_centre(centre_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.centre_staff cs
    JOIN public.profiles p ON cs.officer_profile_id = p.id
    WHERE p.auth_user_id = auth.uid()
    AND cs.centre_id = centre_uuid
    AND cs.is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS: PROFILES
CREATE POLICY "Users can read their own profile" 
ON public.profiles FOR SELECT 
USING (auth_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update their own profile language and contact" 
ON public.profiles FOR UPDATE 
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- RLS: FARMER PROFILES
CREATE POLICY "Farmers can read their own farmer profile" 
ON public.farmer_profiles FOR SELECT 
USING (profile_id = public.current_profile_id() OR public.is_admin());

CREATE POLICY "Farmers can update their own farmer profile" 
ON public.farmer_profiles FOR UPDATE 
USING (profile_id = public.current_profile_id())
WITH CHECK (profile_id = public.current_profile_id());

-- RLS: PROCUREMENT CENTRES (Publicly viewable for discovery)
CREATE POLICY "Anyone can view active procurement centres" 
ON public.procurement_centres FOR SELECT 
USING (true);

CREATE POLICY "Only admins and assigned officers can update centre status" 
ON public.procurement_centres FOR UPDATE 
USING (public.is_admin() OR public.is_officer_at_centre(id));

-- RLS: SLOTS (Publicly viewable for booking)
CREATE POLICY "Anyone authenticated can view slot availability" 
ON public.slots FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify slot configurations" 
ON public.slots FOR ALL 
USING (public.is_admin());

-- RLS: BOOKINGS
CREATE POLICY "Farmers can view own bookings" 
ON public.bookings FOR SELECT 
USING (farmer_profile_id = public.current_profile_id() OR public.is_officer_at_centre(centre_id) OR public.is_admin());

CREATE POLICY "Farmers can create own bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (farmer_profile_id = public.current_profile_id());

CREATE POLICY "Farmers can cancel own bookings" 
ON public.bookings FOR UPDATE 
USING (farmer_profile_id = public.current_profile_id());

-- RLS: QUEUE TOKENS
CREATE POLICY "Farmers can view their own tokens and officers can view assigned centre tokens" 
ON public.queue_tokens FOR SELECT 
USING (farmer_profile_id = public.current_profile_id() OR public.is_officer_at_centre(centre_id) OR public.is_admin());

CREATE POLICY "Only officers and system can update token status" 
ON public.queue_tokens FOR UPDATE 
USING (public.is_officer_at_centre(centre_id) OR public.is_admin());

-- RLS: QUEUE STATUS (Public live status for display boards and farmer app)
CREATE POLICY "Anyone can read live queue status" 
ON public.queue_status FOR SELECT 
USING (true);

CREATE POLICY "Only officers can update queue status" 
ON public.queue_status FOR UPDATE 
USING (public.is_officer_at_centre(centre_id) OR public.is_admin());

-- RLS: PROCUREMENT RECORDS
CREATE POLICY "Farmers see own procurement, officers see assigned centre procurement" 
ON public.procurement_records FOR SELECT 
USING (farmer_profile_id = public.current_profile_id() OR public.is_officer_at_centre(centre_id) OR public.is_admin());

CREATE POLICY "Officers can update procurement inspection" 
ON public.procurement_records FOR UPDATE 
USING (public.is_officer_at_centre(centre_id) OR public.is_admin());

-- RLS: PAYMENT RECORDS
CREATE POLICY "Farmers see own payment status, admins see all" 
ON public.payment_records FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.procurement_records pr
    WHERE pr.id = procurement_record_id
    AND (pr.farmer_profile_id = public.current_profile_id() OR public.is_admin())
  )
);

-- RLS: NOTIFICATIONS
CREATE POLICY "Users can only read their own notifications" 
ON public.notifications FOR SELECT 
USING (profile_id = public.current_profile_id());

-- RLS: AUDIT LOGS (Immutable append-only: no updates or deletes allowed)
CREATE POLICY "Auditors and admins can read audit logs" 
ON public.audit_logs FOR SELECT 
USING (public.is_admin());

CREATE POLICY "System can insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (true);

-- RLS: TRUSTED HELPERS
CREATE POLICY "Farmers and helpers can view delegations" 
ON public.trusted_helpers FOR SELECT 
USING (farmer_profile_id = public.current_profile_id() OR helper_profile_id = public.current_profile_id() OR public.is_admin());

CREATE POLICY "Farmers can manage their trusted helpers" 
ON public.trusted_helpers FOR ALL 
USING (farmer_profile_id = public.current_profile_id());
