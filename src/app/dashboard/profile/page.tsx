'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import WizardProgress, { STEPS } from '@/components/wizard/WizardProgress';
import StepAboutYou from '@/components/wizard/StepAboutYou';
import StepProfessional from '@/components/wizard/StepProfessional';
import StepInterests from '@/components/wizard/StepInterests';
import StepGroupPreferences from '@/components/wizard/StepGroupPreferences';
import StepCommunicationPreferences from '@/components/wizard/StepCommunicationPreferences';
import StepCommunityProfile from '@/components/wizard/StepCommunityProfile';
import StepComplete from '@/components/wizard/StepComplete';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import Link from 'next/link';

export default function ProfileWizardPage() {
  useAuthFromUrl();
  const { profile, loading, error, reload } = useProfile();

  // Resume at the first incomplete section rather than always starting at step 0 —
  // matches the "intelligent" progressive-disclosure behaviour from the spec.
  // findIndex returns -1 once every section is done, which must land on the
  // "complete" screen (index STEPS.length), not get clamped back to step 0.
  const firstIncomplete = profile ? STEPS.findIndex((s) => !profile.sectionStatus[s.key]) : 0;
  const initialIndex = firstIncomplete === -1 ? STEPS.length : firstIncomplete;
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const currentIndex = stepIndex ?? initialIndex;

  // "Update profile" from the dashboard links here with ?edit=1 so an
  // already-complete profile opens straight into an editable step instead
  // of the "you're done" screen. Read directly rather than via
  // useSearchParams() — matches useAuthFromUrl()'s approach elsewhere in
  // this app and avoids needing a Suspense boundary.
  useEffect(() => {
    if (!profile || stepIndex !== null) return;
    const wantsEdit = new URLSearchParams(window.location.search).get('edit') === '1';
    if (wantsEdit && initialIndex === STEPS.length) {
      setStepIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to complete your profile.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const goNext = async () => {
    await reload();
    setStepIndex(Math.min(currentIndex + 1, STEPS.length));
  };
  const goBack = () => setStepIndex(Math.max(currentIndex - 1, 0));
  const goToStep = (index: number) => setStepIndex(index);

  const completion = profile?.user.profile_completion ?? 0;
  const step = STEPS[currentIndex];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} photoUrl={profile?.about?.photo_url} title="Complete your profile" />

        <main className="p-8 max-w-2xl mx-auto">
          {profile ? (
            <WizardProgress currentIndex={currentIndex} completion={completion} onStepClick={goToStep} />
          ) : null}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            {currentIndex < STEPS.length && profile ? (
              <>
                {step.key === 'about_you' && <StepAboutYou profile={profile} onNext={goNext} onBack={currentIndex > 0 ? goBack : undefined} />}
                {step.key === 'professional' && <StepProfessional profile={profile} onNext={goNext} onBack={goBack} />}
                {step.key === 'interests' && <StepInterests profile={profile} onNext={goNext} onBack={goBack} />}
                {step.key === 'group_preferences' && <StepGroupPreferences profile={profile} onNext={goNext} onBack={goBack} />}
                {step.key === 'communication_preferences' && <StepCommunicationPreferences profile={profile} onNext={goNext} onBack={goBack} />}
                {step.key === 'community_profile' && <StepCommunityProfile profile={profile} onNext={goNext} onBack={goBack} />}
                {step.key === 'final_confirmation' && <StepComplete completion={completion} />}
              </>
            ) : (
              <StepComplete completion={completion} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
