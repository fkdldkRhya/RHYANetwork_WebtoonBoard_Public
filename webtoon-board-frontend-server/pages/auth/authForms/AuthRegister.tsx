import { Box, Typography, Button, Divider } from "@mui/material";
import Link from "next/link";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import { Stack } from "@mui/system";
import { registerType } from "../../../src/types/auth/auth";
import AuthSocialButtons from "./AuthSocialButtons";
import { useFormik } from "formik";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { addUserAccountClient } from "@/backend-api/client/UserInfoClient";
import { PagePath } from "../../../middleware";

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const socialSingUpEvent = () => {
    toast.warn("소셜 회원가입은 현재 지원하지 않습니다.", {
      autoClose: 1000,
    });
  }

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        if (submitLoading) return;
        
        setIsDisabled(true);
        setSubmitLoading(true);

        let userId : string = values.id;
        let name : string = values.name;
        let email : string = values.email;
        let password : string = values.password;
        
        userId = userId.trim();
        userId = userId.replace(/(\s*)/g, "");
        name = name.trim();
        name = name.replace(/(\s*)/g, "");
        email = email.trim();
        email = email.replace(/(\s*)/g, "");
        password = password.trim();
        password = password.replace(/(\s*)/g, "");

        // 사용자 입력값 유효성 검사
        // ===============================================
        if (!userId.trim()) {
          toast.error("아이디를 입력해주세요.", {
            autoClose: 1000,
          });
          
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }

        if (!name.trim()) {
          toast.error("이름을 입력해주세요.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }

        if (!email.trim()) {
          toast.error("이메일을 입력해주세요.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }

        if (!password.trim()) {
          toast.error("비밀번호를 입력해주세요.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        // ===============================================

        // 사용자 아이디 유효성 검사
        // ===============================================
        if (!(userId.length >= 5)) {
          toast.error("아이디는 5글자 이상 입력해주세요.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        
        if (userId.length > 30) {
          toast.error("아이디는 30글자 이하로 입력해주세요.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        // ===============================================

        // 사용자 이름 유효성 검사
        // ===============================================
        if (!(name.length >= 2)) {
          toast.error("이름은 2글자 이상 입력해주세요.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        if (name.length > 40) {
          toast.error("이름은 40글자 이하로 입력해주세요.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        // ===============================================

        // 사용자 이메일 유효성 검사
        // ===============================================
        if (!(email.length >= 5)) {
          toast.error("이메일은 5글자 이상 입력해주세요.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        if (email.length > 65) {
          toast.error("이메일은 65글자 이하로 입력해주세요.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        // ===============================================

        // 사용자 비밀번호 유효성 검사
        // ===============================================
        if (!(password.length >= 5)) {
          toast.error("비밀번호는 5글자 이상 입력해주세요.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        if (password.length > 100) {
          toast.error("비밀번호는 100글자 이하로 입력해주세요.", {
            autoClose: 1000,
          });

          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        // ===============================================

        // 이메일 정규식 검사
        // ===============================================
        const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
        if (!emailRegex.test(email)) {
          toast.error("이메일 형식이 올바르지 않습니다.", {
            autoClose: 1000,
          });
              
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        // ===============================================

        // 아이디 정규식 검사
        // ===============================================
        const userIdRegex = /^[A-Za-z0-9+]*$/;
        if (!userIdRegex.test(userId)) {
          toast.error("아이디 형식이 올바르지 않습니다.", {
            autoClose: 1000,
          });

          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }
        // ===============================================

        // 이름 정규식 검사
        // ===============================================
        const nameRegex = /^[가-힣a-zA-Z]+$/;
        if (!nameRegex.test(name)) {
          toast.error("이름 형식이 올바르지 않습니다.", {
            autoClose: 1000,
          });
          
          setIsDisabled(false);
          setSubmitLoading(false);

          return;
        }

        toast.promise(
          async () => {
            try {
              let registerUserAccountResult : any = await addUserAccountClient(values.id, values.password, values.name, values.email);
              if (registerUserAccountResult.result) {
                window.location.href = PagePath.AUTH_AUTH1_LOGIN;
                return;
              }else {
                toast.error(registerUserAccountResult.data, {
                  autoClose: 2000,
                });
              }
            }catch {
              toast.error("알 수 없는 오류가 발생하였습니다.", {
                autoClose: 2000,
              });
            }

            setIsDisabled(false);
            setSubmitLoading(false);
          },
          {
            pending: "회원가입 중입니다...",
          },
          {
            position: "top-right",
          }
        );
      }catch (error: any) {
        toast.error("알 수 없는 오류가 발생하였습니다.", {
          autoClose: 1000,
        });

        setIsDisabled(false);
        setSubmitLoading(false);
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
      <AuthSocialButtons title="Sign up with" buttonEvent={socialSingUpEvent}/>
      <form onSubmit={formik.handleSubmit}>
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
            or sign up with
          </Typography>
        </Divider>
      </Box>

      <Box>
        <Stack mb={3}>
        <CustomFormLabel htmlFor="id">UserID</CustomFormLabel>
          <CustomTextField id="id" variant="outlined" fullWidth value={formik.values.id} onChange={formik.handleChange} />
          <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
          <CustomTextField id="name" variant="outlined" fullWidth value={formik.values.name} onChange={formik.handleChange}/>
          <CustomFormLabel htmlFor="email">Email Adddress</CustomFormLabel>
          <CustomTextField id="email" type="email" variant="outlined" fullWidth value={formik.values.email} onChange={formik.handleChange}/>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField id="password" type="password" variant="outlined" fullWidth value={formik.values.password} onChange={formik.handleChange}/>
        </Stack>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={isDisabled}
        >
          Sign Up
        </Button>
      </Box>
      </form>
      {subtitle}
    </>
  )
}


export default AuthRegister;
