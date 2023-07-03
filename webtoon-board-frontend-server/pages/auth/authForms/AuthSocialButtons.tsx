import CustomSocialButton from "../../../src/components/forms/theme-elements/CustomSocialButton";
import { Stack } from "@mui/system";
import { Avatar, Box } from "@mui/material";
import { signInType } from "../../../src/types/auth/auth";

const AuthSocialButtons = ({ title, buttonEvent }: signInType) => (
  <>
    <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
      <CustomSocialButton onClick={buttonEvent}>
        <Avatar
          src={"/images/svgs/google-icon.svg"}
          alt={"icon1"}
          sx={{
            width: 16,
            height: 16,
            borderRadius: 0,
            mr: 1,
          }}
        />
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            whiteSpace: "nowrap",
            mr: { sm: "3px" },
          }}
        >
          {title}{" "}
        </Box>{" "}
        Google
      </CustomSocialButton>
      <CustomSocialButton onClick={buttonEvent}>
        <Avatar
          src={"/images/svgs/facebook-icon.svg"}
          alt={"icon2"}
          sx={{
            width: 25,
            height: 25,
            borderRadius: 0,
            mr: 1,
          }}
        />
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            whiteSpace: "nowrap",
            mr: { sm: "3px" },
          }}
        >
          {title}{" "}
        </Box>{" "}
        FB
      </CustomSocialButton>
    </Stack>
  </>
);

export default AuthSocialButtons;
