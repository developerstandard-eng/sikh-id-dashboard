'use client';

import { useState } from 'react';
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

  const completion = profile?.user.profile_completion ?? 0;
  const step = STEPS[currentIndex];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} title="Complete your profile" />

        <main className="p-8 max-w-2xl mx-auto">
          {currentIndex < STEPS.length ? (
            <>
              <WizardProgress currentIndex={currentIndex} completion={completion} />
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                {step.key === 'about_you' && <StepAboutYou onNext={goNext} onBack={currentIndex > 0 ? goBack : undefined} />}
                {step.key === 'professional' && <StepProfessional onNext={goNext} onBack={goBack} />}
                {step.key === 'interests' && <StepInterests onNext={goNext} onBack={goBack} />}
                {step.key === 'group_preferences' && <StepGroupPreferences onNext={goNext} onBack={goBack} />}
                {step.key === 'communication_preferences' && <StepCommunicationPreferences onNext={goNext} onBack={goBack} />}
                {step.key === 'community_profile' && <StepCommunityProfile onNext={goNext} onBack={goBack} />}
                {step.key === 'final_confirmation' && <StepComplete completion={completion} />}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <StepComplete completion={completion} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
