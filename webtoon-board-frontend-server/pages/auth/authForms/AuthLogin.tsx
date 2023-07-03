import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { loginType } from "../../../src/types/auth/auth";
import CustomCheckbox from "../../../src/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";

import AuthSocialButtons from "./AuthSocialButtons";
import { useState } from "react";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { AUTO_LOGIN_COOKIE_NAME, LOGIN_COOKIE_NAME } from "@/backend-api/auth/LoginChecker";
import { findUserFromIdAndPasswordEncryptValueClient } from "@/backend-api/client/UserInfoClient";
import { setCookie } from "cookies-next";
import 'react-toastify/dist/ReactToastify.css';
import { PagePath } from "../../../middleware";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const socialSingInEvent = (e: any) => {
    toast.warn("소셜 로그인은 현재 지원하지 않습니다.", {
      autoClose: 1000,
    });
  }

  const forgetPasswordEvent = (e: any) => {
    toast.warn("비밀번호 찾기 기능은 현재 지원하지 않습니다.", {
      autoClose: 1000,
    });
  }

  const formik = useFormik({
    initialValues: {
      id: '',
      password: '',
      rememberMe : [],
    },
    onSubmit: async (values) => {
      try {
        if (submitLoading) return;
        
        setSubmitLoading(true);
        setIsDisabled(true);

        let id : string = values.id;
        let password : string = values.password;
        const rememberMe = values.rememberMe;

        id = id.trim();
        id = id.replace(/(\s*)/g, "");
        password = password.trim();
        password = password.replace(/(\s*)/g, "");
  
        if (!id.trim()) {
          toast.warn("아이디를 입력해주세요.", {
            autoClose: 1000,
          });

          setSubmitLoading(false);
          setIsDisabled(false);

          return;
        }
  
        if (!(id.length >= 5)) {
          toast.warn("아이디는 5글자 이상 입력해주세요.", {
            autoClose: 1000,
          });
  
          setSubmitLoading(false);
          setIsDisabled(false);

          return;
        }
        
        if (!password.trim()) {
          toast.warn("비밀번호를 입력해주세요.", {
            autoClose: 1000,
          });
  
          setSubmitLoading(false);
          setIsDisabled(false);

          return;
        }

        // 아이디는 30글자 이하 비밀번호는 100글자 이하
        if (!(id.length <= 30 && password.length <= 100)) {
          toast.warn("아이디는 30글자 이하, 비밀번호는 100글자 이하로 입력해주세요.", {
            autoClose: 1000,
          });

          setSubmitLoading(false);
          setIsDisabled(false);

          return;
        }

        toast.promise(
          async () => {
            try {
              let loginResult : any = await findUserFromIdAndPasswordEncryptValueClient(values.id, values.password);
              if (loginResult.result && loginResult.data.session) {
                if (rememberMe.length > 0 && rememberMe[0] === "rememberMe") { // 자동 로그인 설정
                  setCookie(AUTO_LOGIN_COOKIE_NAME, true);
                }else {
                  setCookie(AUTO_LOGIN_COOKIE_NAME, false);
                }

                // 세션 로그인 설정
                setCookie(LOGIN_COOKIE_NAME, decodeURI(loginResult.data.session));
                // 메인 페이지 이동
                window.location.href = PagePath.DASHBOARDS_MODERN;

                return;
              }
              
              setSubmitLoading(false);
              setIsDisabled(false);

              throw new Error();
            }catch {
              setSubmitLoading(false);
              setIsDisabled(false);

              toast.error("아이디 또는 비밀번호가 일치하지 않습니다.", {
                autoClose: 1000,
              });
            }
          },
          {
            pending: "로그인 중입니다...",
          },
          {
            position: "top-right",
          }
        );
      }catch (error: any) {
        toast.error("알 수 없는 오류가 발생하였습니다.", {
          autoClose: 1000,
        });

        setSubmitLoading(false);
        setIsDisabled(false);
      }
    }
  });

  return (
    <>
      <ToastContainer />
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <form onSubmit={formik.handleSubmit}>
      <AuthSocialButtons title="Sign in with" buttonEvent={socialSingInEvent} />
      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign in with
          </Typography>
        </Divider>
      </Box>

      <Stack>
        <Box>
          <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
          <CustomTextField 
           id="id"
           type="text"
           variant="outlined" 
           value={formik.values.id} 
           onChange={formik.handleChange} 
           fullWidth />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            value={formik.values.password} 
            onChange={formik.handleChange} 
            fullWidth
          />
        </Box>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <CustomCheckbox 
                  id="rememberMe"
                  value="rememberMe"
                  onChange={formik.handleChange}
                />
              }
              label="Remeber this Device"
            />
          </FormGroup>
          <Typography
            onClick={forgetPasswordEvent}
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={isDisabled}
        >
          Sign In
        </Button>
      </Box>
      </form>
      {subtitle}
    </>
  );
}

export default AuthLogin;
