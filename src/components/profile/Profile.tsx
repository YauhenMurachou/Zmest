import { FC, memo } from 'react';

import Loader from 'src/components/common/atoms/loader/Loader';
import ProfileInfoContainer from 'src/components/profile/profileInfoContainer/ProfileInfoContainer';
import ProfilePosts from 'src/components/profile/ProfilePosts';
import { ProfileType } from 'src/types';

import classes from './Profile.module.css';

type Props = {
  profile: ProfileType;
  status: string;
  isOwner: boolean;
  updateStatus: (status: string) => void;
  sendPhoto: (file: string | Blob) => void;
};

const Profile: FC<Props> = memo(
  ({ profile, status, isOwner, updateStatus, sendPhoto }) => (
    <div className={classes.content}>
      {profile ? (
        <>
          <aside className={classes.aside}>
            <ProfileInfoContainer
              profile={profile}
              status={status}
              isOwner={isOwner}
              updateStatus={updateStatus}
              sendPhoto={sendPhoto}
            />
          </aside>
          <main className={classes.main}>
            <ProfilePosts
              authorId={profile.userId}
              isOwner={isOwner}
            />
          </main>
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
);

export default Profile;
