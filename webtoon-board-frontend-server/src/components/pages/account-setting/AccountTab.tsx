import React, { useState } from 'react';
import { CardContent, Grid, Typography, Box, Avatar, Button, InputAdornment, OutlinedInput } from '@mui/material';

// components
import BlankCard from '../../shared/BlankCard';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

// images
import { Stack } from '@mui/system';

import 'react-toastify/dist/ReactToastify.css'; 
import { toast, ToastContainer } from 'react-toastify';
import { updateUserInfoOnlyUserName, updateUserPasswordForFrontend } from '@/backend-api/client/UserInfoClient';
import { IconAccessible, IconLock, IconMail, IconUser } from '@tabler/icons-react';

const AccountTab = (props: any) => {
  const profileImageChangeEvent = (e: any) => {
    toast.warn("프로필 이미지 변경 기능은 현재 지원하지 않습니다.", {
      autoClose: 1000,
    });
  }
  
  const [userId, setUserId] = useState(props.userInfo.userId as string);
  const [userRole, setUserRole] = useState(props.userInfo.role as string);
  const [userEmail, setUserEmail] = useState(props.userInfo.userEmail as string);
  const [userName, setUserName] = useState(props.userInfo.userName as string);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangeForUserName = (event: any) => {
    setUserName(event.target.value);
  };

  const handleChangeForCurrentPassword = (event: any) => {
    setCurrentPassword(event.target.value);
  };

  const handleChangeForNewPassword = (event: any) => {
    setNewPassword(event.target.value);
  };

  const handleChangeForConfirmPassword = (event: any) => {
    setConfirmPassword(event.target.value);
  };

  const cancelEvent = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setUserId(props.userInfo.userId as string);
    setUserRole(props.userInfo.role as string);
    setUserEmail(props.userInfo.userEmail as string);
    setUserName(props.userInfo.userName as string);
  };

  const saveEvent = async () => {
    try {
      let isChangePassword: boolean = false;

      // 비밀번호 변경 여부 확인
      if (currentPassword !== '' || newPassword !== '' || confirmPassword !== '') {
        isChangePassword = true;
      }

      if (isChangePassword) {
        // 현재 비밀번호 입력 확인
        if (currentPassword === '') {
          toast.warn("현재 비밀번호를 입력해주세요.", {
            autoClose: 1000,
          });
          return;
        }

        // 현재 비밀번호 길이 확인
        if (currentPassword.length < 5) {
          toast.warn("현재 비밀번호는 5자리 이상이어야 합니다.", {
            autoClose: 1000,
          });
          return;
        }

        // 현재 비밀번호 길이 확인
        if (currentPassword.length > 100) {
          toast.warn("현재 비밀번호는 100자리 이하이어야 합니다.", {
            autoClose: 1000,
          });
          return;
        }

        // 비밀번호 변경 시, 비밀번호 확인
        if (newPassword !== confirmPassword) {
          toast.warn("비밀번호가 일치하지 않습니다. 다시 확인해주세요.", {
            autoClose: 1000,
          });
          return;
        }
        // 비밀번호 길이 확인
        if (newPassword.length < 5) {
          toast.warn("비밀번호는 5자리 이상이어야 합니다.", {
            autoClose: 1000,
          });
          return;
        }
        // 비밀번호 길이 확인
        if (newPassword.length > 100) {
          toast.warn("비밀번호는 100자리 이하이어야 합니다.", {
            autoClose: 1000,
          });
          return;
        }

        // 비밀번호 변경
        if (await updateUserPasswordForFrontend(props.userInfo.userId, currentPassword, newPassword)) {
          toast.success("비밀번호가 변경되었습니다.", {
            autoClose: 1000,
          });

          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }else {
          toast.error("비밀번호 변경에 실패하였습니다. 다시 시도해주세요.", {
            autoClose: 1000,
          });
        }
      }

      // 사용자 정보 변경
      if (await updateUserInfoOnlyUserName(parseInt(props.userInfo.id), userId, props.token, userName)) {
        toast.success("사용자 정보가 변경되었습니다.", {
          autoClose: 1000,
        });
      }else {
        toast.error("사용자 정보 변경에 실패하였습니다. 다시 시도해주세요.", {
          autoClose: 1000,
        });
      }
    }catch(e) {
      toast.error("사용자 정보 변경에 실패하였습니다. 다시 시도해주세요.", {
        autoClose: 1000,
      });
    }
  };

  return (
    <Grid container spacing={3}>
      <ToastContainer />
      {/* Change Profile */}
      <Grid item xs={12} lg={6}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Change Profile
            </Typography>
            <Typography color="textSecondary" mb={3}>Change your profile picture from here</Typography>
            <Box textAlign="center" display="flex" justifyContent="center">
              <Box>
                <Avatar
                  src={"/images/profile/anim-user-image-sunaokami-shiroko.jpg"}
                  alt={"user1"}
                  sx={{ width: 120, height: 120, margin: '0 auto' }}
                />
                <Stack direction="row" justifyContent="center" spacing={2} my={3}>
                  <Button variant="contained" color="primary" component="label">
                    Upload
                    {/* <input hidden accept="image/*" multiple type="file" /> */}
                    <input hidden onClick={profileImageChangeEvent} />
                  </Button>
                  <Button variant="outlined" color="error" component="label">
                    Reset
                    <input hidden onClick={profileImageChangeEvent} />
                  </Button>
                </Stack>
                <Typography variant="subtitle1" color="textSecondary" mb={4}>
                  Allowed JPG, GIF or PNG. Max size of 800K
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </BlankCard>
      </Grid>
      {/*  Change Password */}
      <Grid item xs={12} lg={6}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Change Password
            </Typography>
            <Typography color="textSecondary" mb={3}>To change your password please confirm here</Typography>
              <CustomFormLabel htmlFor="pwd-text">Current Password</CustomFormLabel>
              <OutlinedInput
                type="password"
                startAdornment={
                  <InputAdornment position="start">
                    <IconLock width={20} />
                  </InputAdornment>
                }
                id="pwd-text"
                placeholder="Current Password"
                value={currentPassword} 
                onChange={handleChangeForCurrentPassword} 
                fullWidth
              />
              {/* 2 */}
              <CustomFormLabel htmlFor="pwd-text">New Password</CustomFormLabel>
              <OutlinedInput
                type="password"
                startAdornment={
                  <InputAdornment position="start">
                    <IconLock width={20} />
                  </InputAdornment>
                }
                id="pwd-text"
                placeholder="New Password"
                value={newPassword}
                onChange={handleChangeForNewPassword}
                fullWidth
              />
              {/* 3 */}
              <CustomFormLabel htmlFor="pwd-text">Confirm Password</CustomFormLabel>
              <OutlinedInput
                type="password"
                startAdornment={
                  <InputAdornment position="start">
                    <IconLock width={20} />
                  </InputAdornment>
                }
                id="pwd-text"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleChangeForConfirmPassword}
                fullWidth
              />
          </CardContent>
        </BlankCard>
      </Grid>
      {/* Edit Details */}
      <Grid item xs={12}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Personal Details
            </Typography>
            <Typography color="textSecondary" mb={3}>To change your personal detail , edit and save from here</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="username-text"
                  >
                    UserID
                  </CustomFormLabel>
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <IconUser width={20} />
                      </InputAdornment>
                    }
                    id="username-text"
                    value={userId}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="username-text"
                  >
                    Username
                  </CustomFormLabel>
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <IconUser width={20} />
                      </InputAdornment>
                    }
                    id="username-text"
                    value={userName} 
                    onChange={handleChangeForUserName} 
                    placeholder="Username"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 3 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="username-text"
                  >
                    Role
                  </CustomFormLabel>
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <IconAccessible width={20} />
                      </InputAdornment>
                    }
                    id="username-text"
                    value={userRole}
                    disabled
                    fullWidth
                  />
                </Grid>
                {/*
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-currency"
                  >
                    Currency
                  </CustomFormLabel>
                  <CustomSelect
                    fullWidth
                    id="text-currency"
                    variant="outlined"
                    value={currency}
                    onChange={handleChange2}
                  >
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                */}
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="username-text"
                  >
                    Email
                  </CustomFormLabel>
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <IconMail width={20} />
                      </InputAdornment>
                    }
                    id="username-text"
                    value={userEmail}
                    disabled
                    fullWidth
                  />
                </Grid>
                {/*
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-phone"
                  >
                    Phone
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-phone"
                    value="+91 12345 65478"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-address"
                  >
                    Address
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-address"
                    value="814 Howard Street, 120065, India"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                  */}
              </Grid>

          </CardContent>
        </BlankCard>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }} mt={3}>
          <Button size="large" variant="contained" color="primary" onClick={saveEvent}>
            Save
          </Button>
          <Button size="large" variant="text" color="error" onClick={cancelEvent}>
            Cancel
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AccountTab;
