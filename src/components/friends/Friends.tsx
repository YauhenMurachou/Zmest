import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Loader from 'src/components/common/atoms/loader/Loader';
import SearchField from 'src/components/common/atoms/searchField/SearchField';
import UsersPagination from 'src/components/common/atoms/usersPagination/UsersPagination';
import EmptyState from 'src/components/common/molecules/EmptyState/EmptyState';
import DialogModalWrapper from 'src/components/common/molecules/dialogModalWrapper/DialogModalWrapper';
import UserItem from 'src/components/common/molecules/userItem/UserItem';
import { useSearch } from 'src/hooks/useSearch';
import { RootState } from 'src/redux/redux-store';
import {
  followUsersThunkCreator,
  getUsersThunkCreator,
  unfollowUsersThunkCreator,
} from 'src/redux/usersReducer';
import { UserType } from 'src/types';
import { calculatePagesCount, getUsers } from 'src/utils/users';

import classes from './Friends.module.css';

const Friends: FC = () => {
  const dispatch = useDispatch();
  const [currentPage, setPage] = useState(1);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isPopperOpen, setPopperOpen] = useState(false);
  const [companion, setCompanion] = useState<UserType>();
  const { isAuth, isFetching, friends, followingInProgress, pageSize } =
    useSelector((state: RootState) => ({
      isAuth: state.auth.isAuth,
      isFetching: state.users.isFetching,
      pageSize: state.users.pageSize,
      friends: state.users.users,
      followingInProgress: state.users.followingInProgressUsers,
    }));
  const { t } = useTranslation();

  useEffect(() => {
    getUsers(dispatch, currentPage, 100, undefined, true);
  }, [currentPage, dispatch]);

  const handleDialogOpen = (companion?: UserType) => {
    setDialogOpen(true);
    setCompanion(companion);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const pagesCount = calculatePagesCount(friends.length, pageSize);

  const { setSearchValue, searchValue } = useSearch(
    getUsers,
    currentPage,
    pageSize,
    true
  );

  const handlePageChange = (pageNumber: number) => {
    dispatch(getUsersThunkCreator(pageNumber, pageSize, undefined, true));
  };

  const unfollow = (id: number) => {
    dispatch(unfollowUsersThunkCreator(id));
  };

  if (!isAuth) {
    return <Redirect to="/Login" />;
  }

  if (isFetching) {
    return <Loader isFetching={isFetching} />;
  }

  return (
    <div className={classes.wrapper}>
      {!isFetching && (
        <>
          <div className={classes.header}>All friends({friends.length})</div>
          <SearchField
            placeholder={t('users.search')}
            setSearchValue={setSearchValue}
            searchValue={searchValue}
            isSearch={!!searchValue}
          />
          <ul className={classes.itemWrapper}>
            {friends.map((friend) => (
              <UserItem
                user={friend}
                followUsers={() => {
                  dispatch(followUsersThunkCreator(friend.id as number));
                }}
                unfollowUsers={() => unfollow(friend.id as number)}
                followingInProgress={followingInProgress}
                handleDialogOpen={() => handleDialogOpen(friend)}
                key={uuidv4()}
              />
            ))}
          </ul>
          {pagesCount > 1 && (
            <UsersPagination
              pagesCount={pagesCount}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              setPage={setPage}
            />
          )}
          {!!searchValue && !friends.length && (
            <EmptyState text={t('users.nothing')} />
          )}
          <DialogModalWrapper
            isDialogOpen={isDialogOpen}
            setPopperOpen={setPopperOpen}
            handleDialogOpen={handleDialogClose}
            companion={companion as UserType}
            isPopperOpen={isPopperOpen}
          />
        </>
      )}
    </div>
  );
};

export default Friends;
