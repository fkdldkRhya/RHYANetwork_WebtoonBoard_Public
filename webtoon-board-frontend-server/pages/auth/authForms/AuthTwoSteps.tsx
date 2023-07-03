import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomTextFieldAuthCode from "@/components/forms/theme-elements/CustomTextFieldAuthCode";
import { PagePath } from "../../../middleware";
import { checkUserEmailAuthCode } from "@/backend-api/client/UserInfoClient";

const AuthTwoSteps = (authInfo: any) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const customOnChange = (e : any) => {
    try {
      let inputValue : string = e.nativeEvent.data;
      const defaultValue : string = e.target.value;
  
      if (inputValue.length != 1)
        inputValue = inputValue.substring(0, 1);
  
      const regExp = /^[0-9]*$/;
      if (!regExp.test(inputValue)) {
        e.target.value = defaultValue;
        return;
      }
  
      if (!inputValue || Number.parseInt(inputValue) < 0) {
        e.target.value = defaultValue;
        return;
      }

      e.target.value = "";
      e.target.value = inputValue;

      if (inputValue) {
        switch (e.target.id) {
          case "code1":
            document.getElementById("code2")?.focus();
            break;
          case "code2":
            document.getElementById("code3")?.focus();
            break;
          case "code3":
            document.getElementById("code4")?.focus();
            break;
          case "code4":
            document.getElementById("code5")?.focus();
            break;
          case "code5":
            document.getElementById("code6")?.focus();
            break;
        }
      }
    } catch {}

    formik.handleChange(e);
  }

  const formik = useFormik({
    initialValues: {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: '',
    },
    onSubmit: async (values) => {
      try {
        if (!(authInfo.authInfo && authInfo.authInfo.userId && authInfo.authInfo.requestCode)) {
          toast.error("사용자 인증정보가 존재하지 않습니다. 페이지를 새로고침 해주십시오.", {
            autoClose: 1500,
          });

          setSubmitLoading(false);
          setIsDisabled(false);

          return;
        }

        if (submitLoading) return;
        
        setSubmitLoading(true);
        setIsDisabled(true);

        let codeFull : string = `${values.code1}${values.code2}${values.code3}${values.code4}${values.code5}${values.code6}`;

        // 인증코드 입력 확인
        if (!codeFull || codeFull.length != 6) {
          toast.warn("인증코드를 입력해주세요.", {
            autoClose: 1500,
          });

          setSubmitLoading(false);
          setIsDisabled(false);

          return;
        }

        // 인증코드 정규식 확인
        const regExp = /^[0-9]*$/;
        if (!regExp.test(codeFull)) {
          toast.warn("인증코드는 숫자만 입력 가능합니다.", {
            autoClose: 1500,
          });
          
          setSubmitLoading(false);
          setIsDisabled(false);

          return;
        };

        toast.promise(
          async () => {
            try {
              let loginResult : boolean = await checkUserEmailAuthCode(authInfo.authInfo.userId, authInfo.authInfo.requestCode, codeFull, "SIGNUP");
              if (loginResult) {
                // 메인 페이지 이동
                window.location.href = PagePath.DASHBOARDS_MODERN;
  
                return;
              }else {
                toast.error("인증코드가 일치하지 않습니다. 인증코드를 재발송합니다.", {
                  autoClose: 1500,
                  onClose: () => {
                    window.location.href = PagePath.AUTH_AUTH1_LOGIN
                  }
                });
              }
            }catch (error: any) {
              toast.error("알 수 없는 오류가 발생하였습니다.", {
                autoClose: 1000,
                onClose: () => {
                  window.location.href = PagePath.AUTH_AUTH1_LOGIN
                }
              });
            }
          },
          {
            pending: "인증 중입니다...",
          },
          {
            position: "top-right",
          }
        ).catch((error : any) => {
          throw error;
        });
      }catch (error: any) {
        toast.error("알 수 없는 오류가 발생하였습니다.", {
          autoClose: 1000,
          onClose: () => {
            window.location.href = PagePath.AUTH_AUTH1_LOGIN
          }
        });
      }
    }
  });

  return (
      <>
      <ToastContainer />
      <form onSubmit={formik.handleSubmit}>
      <Box mt={4}>
        <Stack mb={3}>
          <CustomFormLabel htmlFor="code">
            Type your 6 digits security code{" "}
          </CustomFormLabel>
          <Stack spacing={2} direction="row">
            <CustomTextFieldAuthCode value={formik.values.code1} onChange={customOnChange} id="code1" name="code1" variant="outlined" type="text" fullWidth />
            <CustomTextFieldAuthCode value={formik.values.code2} onChange={customOnChange} id="code2" name="code2" variant="outlined" type="text" fullWidth />
            <CustomTextFieldAuthCode value={formik.values.code3} onChange={customOnChange} id="code3" name="code3" variant="outlined" type="text" fullWidth />
            <CustomTextFieldAuthCode value={formik.values.code4} onChange={customOnChange} id="code4" name="code4" variant="outlined" type="text" fullWidth />
            <CustomTextFieldAuthCode value={formik.values.code5} onChange={customOnChange} id="code5" name="code5" variant="outlined" type="text" fullWidth />
            <CustomTextFieldAuthCode value={formik.values.code6} onChange={customOnChange} id="code6" name="code6" variant="outlined" type="text" fullWidth />
          </Stack>
        </Stack>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={isDisabled}
        >
          Verify My Account
        </Button>

        <Stack direction="row" spacing={1} mt={3}>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            Didn't get the code?
          </Typography>
          <Typography
            component={Link}
            href={PagePath.AUTH_AUTH1_TWOSTEPS}
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Resend
          </Typography>
        </Stack>
      </Box>
      </form>
    </>
  )
}

export default AuthTwoSteps;
