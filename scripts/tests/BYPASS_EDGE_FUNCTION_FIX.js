// Alternative approach: Bypass Edge Function and create promo claims directly
// This avoids RLS issues entirely

// Add this to your NewCustomerPromoModal.tsx handleClaim function
// Replace the supabase.functions.invoke call with direct database insertion

const handleClaimDirect = async () => {
  setIsLoading(true);

  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + PROMO_CONFIG.daysValid);
    
    const sessionId = generateSessionId();

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required to claim promo");
    }

    // Create promo claim directly in database (bypass Edge Function)
    const { data: newClaim, error } = await supabase
      .from('promo_claims')
      .insert({
        code: PROMO_CONFIG.code,
        user_id: user.id,
        email: user.email,
        service_slug: PROMO_CONFIG.appliesTo,
        applies_to: PROMO_CONFIG.appliesTo,
        session_id: sessionId,
        expires_at: expiresAt.toISOString(),
        status: 'claimed',
      })
      .select()
      .single();

    if (error) {
      console.error('Direct promo claim error:', error);
      throw error;
    }

    // Apply promo to booking state
    setPromo({
      code: PROMO_CONFIG.code,
      type: PROMO_CONFIG.type,
      value: PROMO_CONFIG.value,
      appliesTo: PROMO_CONFIG.appliesTo,
      expiresAt: expiresAt.toISOString(),
      claimId: newClaim.id,
    });

    // Get standard-cleaning service
    const { data: services } = await supabase
      .from('services')
      .select('*')
      .eq('slug', PROMO_CONFIG.appliesTo)
      .single();

    if (services) {
      setService(services.id, services.name, services.slug);
    }

    // Mark as seen
    sessionStorage.setItem('promo_seen_standard20', 'true');

    // Close modal
    setIsOpen(false);

    // Show success toast
    toast({
      title: 'Promo Applied!',
      description: `${PROMO_CONFIG.code}: 20% off ${PROMO_CONFIG.serviceName}`,
    });

    // Navigate to details
    navigate('/booking/details');
  } catch (error) {
    console.error('Error claiming promo:', error);
    toast({
      title: 'Error',
      description: 'Failed to apply promo. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};
