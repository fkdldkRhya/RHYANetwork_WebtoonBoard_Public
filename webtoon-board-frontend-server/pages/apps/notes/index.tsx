import { useState, useEffect } from "react";
import { Box, useMediaQuery, Theme } from "@mui/material";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import NoteSidebar from "../../../src/components/apps/notes/NoteSidebar";
import NoteContent from "../../../src/components/apps/notes/NoteContent";
import AppCard from "../../../src/components/shared/AppCard";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Notes",
  },
];

const Notes = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  useEffect(() => {
    if (lgDown) {
      setMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setMobileSidebarOpen(true);
    }
  }, [lgDown]);

  return (
    <PageContainer>
      <Breadcrumb title="Note app" items={BCrumb} />
      <AppCard>
        {isMobileSidebarOpen ? (
          <NoteSidebar
            isMobileSidebarOpen={isMobileSidebarOpen}
            onSidebarClose={() => setMobileSidebarOpen(false)}
          />
        ) : (
          <></>
        )}

        <Box flexGrow={1}>
          <NoteContent
            toggleNoteSidebar={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
          />
        </Box>
      </AppCard>
    </PageContainer>
  );
};

export default Notes;
