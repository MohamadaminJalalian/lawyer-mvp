"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import { useAuth } from "@/context/AuthContext";
import { useSecretaries } from "@/context/SecretaryContext";
import SecretariesCard from "@/components/settings/SecretariesCard";
import TrashCard from "@/components/settings/TrashCard";
import ChangePasswordCard from "@/components/settings/ChangePasswordCard";
import MyPermissionsCard from "@/components/settings/MyPermissionsCard";
import MyProfileCard from "@/components/settings/MyProfileCard";

export default function SettingsPage() {
  const { currentUser, isLawyer } = useAuth();
  const { getSecretaryById } = useSecretaries();

  const currentSecretary = currentUser.secretaryId
    ? getSecretaryById(currentUser.secretaryId)
    : undefined;

  const canSeeTrash = isLawyer || Boolean(currentSecretary?.permissions.canDeleteFiles);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Breadcrumb trail={["داشبورد"]} title="تنظیمات" />
      </div>

      <div className="flex flex-col gap-5">
        {isLawyer && (
          <>
            <SecretariesCard />
            {canSeeTrash && <TrashCard />}
            <ChangePasswordCard />
          </>
        )}

        {!isLawyer && (
          <>
            {currentSecretary ? (
              <>
                <MyPermissionsCard secretary={currentSecretary} />
                {canSeeTrash && <TrashCard />}
                <MyProfileCard secretary={currentSecretary} />
                <ChangePasswordCard />
              </>
            ) : (
              <p className="text-sm text-[#8C8A80]">
                اطلاعات حساب منشی یافت نشد.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}