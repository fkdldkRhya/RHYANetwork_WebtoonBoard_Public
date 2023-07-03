import {
    CardContent,
    Grid
} from '@mui/material';

// common components
import PageContainer from '../../../src/components/container/PageContainer';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import ChildCard from '../../../src/components/shared/ChildCard';
import BlankCard from '../../../src/components/shared/BlankCard';
import Logo from "../../../src/layouts/full/shared/logo/Logo";

// custom components
import FVLogin from '../../../src/components/forms/form-validation/FVLogin';
import FVRegister from '../../../src/components/forms/form-validation/FVRegister';
import FVOnLeave from '../../../src/components/forms/form-validation/FVOnLeave';
import FVRadio from '../../../src/components/forms/form-validation/FVRadio';
import FVCheckbox from '../../../src/components/forms/form-validation/FVCheckbox';
import FVSelect from '../../../src/components/forms/form-validation/FVSelect';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Form Validation',
    },
];

const FormValidation = () => {
    return (
        <PageContainer>
            <Breadcrumb title="Form Validation" items={BCrumb} />

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    {/* <BlankCard title="Register"> */}
                    <BlankCard>
                        <CardContent sx={{ pt: 0 }}>
                            <Logo />
                            <FVRegister />
                        </CardContent>
                    </BlankCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    {/* <BlankCard title="Login"> */}
                    <BlankCard>
                        <CardContent sx={{ pt: 0 }}>
                            <Logo />
                            <FVLogin />
                        </CardContent>
                    </BlankCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ChildCard title="On Leave">

                        <FVOnLeave />
                    </ChildCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ChildCard title="Select">
                        <FVSelect />
                    </ChildCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ChildCard title="Radio">
                        <FVRadio />
                    </ChildCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ChildCard title="Checkboxes">
                        <FVCheckbox />
                    </ChildCard>
                </Grid>

            </Grid>
        </PageContainer>
    );
};

export default FormValidation;
