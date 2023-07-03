import React, { useEffect, useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Alert,
  MenuItem,
  Autocomplete,
  Slider,
} from '@mui/material';
import PageContainer from '../../../src/components/container/PageContainer';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';

import CustomTextField from '../../../src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from '../../../src/components/shared/ParentCard';
import { Stack } from '@mui/system';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { checkWebtoonAnaylzeRequestForNaverWebtoon, getWebtoonArticleTotalCountForNaverWebtoon, getWebtoonSimpleSearchListForNaverWebtoon, pushWebtoonAnaylzeRequestForNaverWebtoon, removeWebtoonAnaylzeRequestForNaverWebtoon } from '@/backend-api/naver-webtoon/NaverWebtoonClient';
import { LOGIN_COOKIE_NAME, getAutoLoginUserId, setSessionAutoLoginValue, userLogout } from '@/backend-api/auth/LoginChecker';
import { getCookie } from 'cookies-next';
import { getLogger } from '@/backend-api/Logger';
import { findUserFromIdValueClientForSSROnly } from '@/backend-api/client/UserInfoClient';
import { GetServerSidePropsContext } from 'next';
import { PagePath } from '../../../middleware';
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer, toast } from 'react-toastify';

const steps = ['Provider', 'Webtoon Info', 'Finish'];

const WebtoonAnalyzeRequest = (props: any) => {
    const PROVIDER_LIST : Array<any> = [
        {
            index: 0,
            text: 'Naver',
            command: 'NAVER'
        }
    ]

    const userToken : any = getCookie(LOGIN_COOKIE_NAME)?.toString();
    const [activeStep, setActiveStep] = React.useState(props.isEnableWebtoonAnalyzeRequest ? 3 : 0);
    const [selectedWebtoonTitle, setSelectedWebtoonTitle] = useState<any>(null);
    const [selectedWebtoonId, setSelectedWebtoonId] = useState<any>(null);
    const [webtoonTotalArticleCount, setWebtoonTotalArticleCount] = useState<any>(0);
    const [articleRangeValue, setArticleRangeValue] = useState([1, 1]);
    const [provider, setProvider] = useState(0);
    const [targetComment, setTargetComment] = useState('DATE');
    const [webtoonNameAutoCompleteData, setWebtoonNameAutoCompleteData] = useState([]);
    const [isEnableNext, setIsEnableNext] = useState(true);
    const [limitCheckType, setLimitCheckType] = useState('ARTICLE');
    const [limitValue, setLimitValue] = useState(1);

    useEffect(() => {
        switch (activeStep) {
            case 0:
                setIsEnableNext(true);
                break;
            case 1:
                if (selectedWebtoonTitle && selectedWebtoonId)
                    setIsEnableNext(true);
                else
                    setIsEnableNext(false);
                break;
            case 2:
                setIsEnableNext(true);
        }
    }, [activeStep])

    const handleChangeForSetProvider = (event: any) => {
        setProvider(event.target.value);
        setIsEnableNext(true);
    };

    const handleChangeForSetTargetComment = (event: any) => {
        setTargetComment(event.target.value);
    };
    
    const handleChangeForWebtoonName = async (event: any) => {
        const webtoonList: any = await getWebtoonSimpleSearchListForNaverWebtoon(event.target.value, userToken);
        if (webtoonList && webtoonList.searchList)
            setWebtoonNameAutoCompleteData(webtoonList.searchList)
    };

    const handleChangeForWebtoonNameAutoComplete = async (event: any, newValue: any) => {
        try {
            setSelectedWebtoonTitle(newValue.titleName);
            setSelectedWebtoonId(newValue.titleId);
            setWebtoonTotalArticleCount(await getWebtoonArticleTotalCountForNaverWebtoon(newValue.titleId, userToken));
            
            setIsEnableNext(true);
        }catch {

        }
    };

    const handleChangeForArticleRangeValue = (event: any, newValue: any) => {
        if (selectedWebtoonTitle && selectedWebtoonId && webtoonTotalArticleCount > 0 && newValue[0] >= 1)
            setArticleRangeValue(newValue);
    };

    const handleChangeForLimitCheckType = (event: any) => {
        setLimitCheckType(event.target.value);
    };

    const handleChangeForLimitValue = async (event: any) => {
        if (!isNaN(parseFloat(event.target.value)) && !isNaN(event.target.value - 0) && event.target.value >= 0)
            setLimitValue(event.target.value);
    };

    const handleNext = () => {
        if (activeStep === 2) {
            toast.promise(
                async () => 
                {
                    const result = await pushWebtoonAnaylzeRequestForNaverWebtoon(
                        userToken,
                        selectedWebtoonId,
                        parseInt(articleRangeValue[0].toString()),
                        parseInt(articleRangeValue[1].toString()),
                        targetComment,
                        limitCheckType,
                        parseInt(limitValue.toString())
                    );
        
                    if (result) {
                        toast.success("웹툰 분석 요청 전송 성공!", {
                            autoClose: 1000,
                        });
        
                        setActiveStep((prevActiveStep) => prevActiveStep + 1);
                        setIsEnableNext(false);
                    }else {
                        toast.error("웹툰 분석 요청 전송 실패! 다음에 다시 시도하여 주세요.", {
                            autoClose: 1000,
                        });
        
                        setActiveStep(0);
                    }
                },
                {
                    pending: "분석 요청 작업 처리 중입니다...",
                },
                {
                    position: "top-right",
                }
            );
        }else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setIsEnableNext(false);
        }
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        toast.promise(
            async () => 
            {
                if (await removeWebtoonAnaylzeRequestForNaverWebtoon(userToken)) {
                    toast.success("웹툰 분석 요청 제거 성공!", {
                        autoClose: 1000,
                    });
                }else {
                    toast.error("웹툰 분석 요청 제거 실패! 다음에 다시 시도하여 주세요.", {
                        autoClose: 1000,
                    });
                }
        
                setActiveStep(0);
            },
            {
                pending: "분석 요청 작업 처리 중입니다...",
            },
            {
                position: "top-right",
            }
        );
    };

    const handleSteps = (step: any) => {
        switch (step) {
        case 0:
            return (
            <Box>
                <CustomFormLabel htmlFor="ProviderTitle">Webtoon Provider</CustomFormLabel>
                <CustomSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={provider}
                    onChange={handleChangeForSetProvider}
                    fullWidth
                    >
                    {
                        PROVIDER_LIST.map((item: any) => {
                            return (<MenuItem value={item.index}>{item.text}</MenuItem>)
                        })
                    }
                </CustomSelect>
            </Box>
            );
        case 1:
            return (
            <Box>
                <CustomFormLabel htmlFor="Fname">Webtoon Name | [{selectedWebtoonTitle ? selectedWebtoonTitle : "None!"}]</CustomFormLabel>
                <Autocomplete
                    id="country-select-demo"
                    fullWidth
                    options={webtoonNameAutoCompleteData}
                    onChange={handleChangeForWebtoonNameAutoComplete}
                    getOptionLabel={(option: any) => option.titleName}
                    renderOption={(props, option) => (
                        <Box
                            component="li"
                            sx={{ fontSize: 11, '& > span': { mr: '10px', fontSize: 11 } }}
                            {...props}
                        >
                            <span>{option.titleId} | {option.titleName}</span>
                        </Box>
                    )}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            placeholder="Enter a webtoon name"
                            aria-label="Enter a webtoon name"
                            autoComplete="off"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                            onChange={handleChangeForWebtoonName}
                        />
                    )}
                />
                <CustomFormLabel htmlFor="Fname">Webtoon Target Comment</CustomFormLabel>
                <CustomSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={targetComment}
                    onChange={handleChangeForSetTargetComment}
                    fullWidth
                >
                    <MenuItem value="DATE">최신 댓글</MenuItem>
                    <MenuItem value="BEST">베스트 댓글</MenuItem>
                </CustomSelect>
                
                <CustomFormLabel htmlFor="Address">Analyze Target Article Range | [{`${articleRangeValue[0]}화 - ${articleRangeValue[1]}화`}]</CustomFormLabel>
                <Slider
                    getAriaLabel={() => '>Analyze Target Article Range'}
                    value={articleRangeValue}
                    onChange={handleChangeForArticleRangeValue}
                    max={webtoonTotalArticleCount}
                    getAriaValueText={(item: any) => `${item}화`}
                />

                <CustomFormLabel htmlFor="Fname">Webtoon Limit Check Type</CustomFormLabel>
                <CustomSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={limitCheckType}
                    onChange={handleChangeForLimitCheckType}
                    fullWidth
                >
                    <MenuItem value="ARTICLE">회차 기준</MenuItem>
                    <MenuItem value="ALL">전체 기준</MenuItem>
                </CustomSelect>

                <CustomFormLabel htmlFor="Fname">Webtoon Limit Value</CustomFormLabel>
                <CustomTextField id="Fname" type="number" variant="outlined" value={limitValue} onChange={handleChangeForLimitValue} fullWidth />
            </Box>
            );
        case 2:
            return (
            <Box pt={3}>
                <Typography variant="h5">Final Information Confirmation</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Please check the information below. (However, errors may occur when applying for webtoons that are currently analyzed.)
                    <br></br>
                    <br></br>
                    <ul>
                        <li>Webtoon Id: <strong>{selectedWebtoonId}</strong></li>
                        <li>Webtoon Name: <strong>{selectedWebtoonTitle}</strong></li>
                        <li>Webtoon Target Comment: <strong>{targetComment}</strong></li>
                        <li>Webtoon Analyze Target Article Range: <strong>{articleRangeValue[0]}화 ~ {articleRangeValue[1]}화</strong></li>
                        <li>Webtoon Limit Check Type: <strong>{limitCheckType}</strong></li>
                        <li>Webtoon Limit Value: <strong>{limitValue}</strong></li>
                    </ul>
                </Typography>
            </Box>
            );
        default:
            break;
        }
    };

    return (
        <PageContainer>
        <ToastContainer />
        <Breadcrumb title="Webtoon Request" subtitle="this is webtoon analyze request page" />
        <ParentCard title="Webtoon Analyze Request">
            <Box width="100%">
            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                    optional?: React.ReactNode;
                } = {};

                return (
                    <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <>
                <Stack spacing={2} mt={3}>
                    <Alert severity="success">
                    All steps completed - you&apos;re finished
                    </Alert>

                    <Box textAlign="right">
                    <Button onClick={handleReset} variant="contained" color="error">
                        Reset
                    </Button>
                    </Box>
                </Stack>
                </>
            ) : (
                <>
                <Box>{handleSteps(activeStep)}</Box>

                <Box display="flex" flexDirection="row" mt={3}>
                    <Button
                    color="inherit"
                    variant="contained"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    >
                    Back
                    </Button>
                    <Box flex="1 1 auto" />

                    <Button
                    onClick={handleNext}
                    variant="contained"
                    disabled={!isEnableNext}
                    color={activeStep === steps.length - 1 ? 'success' : 'secondary'}
                    >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
                </>
            )}
            </Box>
        </ParentCard>
        </PageContainer>
    );
};

export default WebtoonAnalyzeRequest;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
      // 자동 로그인
      const getUserId: number = getAutoLoginUserId(context.req, context.res);
      const userInfo : any = await findUserFromIdValueClientForSSROnly(getUserId, context);
  
      if (userInfo) { // 자동 로그인 성공
        setSessionAutoLoginValue(context.req, context.res); // 로그인 데이터 갱신

        // 웹툰 분석 요청 가능한지 체크
        const isEnableWebtoonAnalyzeRequest : boolean = await checkWebtoonAnaylzeRequestForNaverWebtoon(getCookie(LOGIN_COOKIE_NAME, {req: context.req, res: context.res}) as any)
        
        return {
          props:{
            isEnableWebtoonAnalyzeRequest : isEnableWebtoonAnalyzeRequest,
          },
        };
      }
    }catch (error : any) {
      // 예외 처리
      getLogger().error(error.toString());
    }
    
    // 로그아웃
    userLogout(context.req, context.res);
  
    // 로그인 페이지로 이동
    return {
      redirect: {
        destination: PagePath.AUTH_AUTH1_LOGIN,
        permanent: false,
      },
      props:{},
    };
  }