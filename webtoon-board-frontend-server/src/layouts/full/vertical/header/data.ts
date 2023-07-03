// Notifications dropdown

import { PagePath } from "../../../../../middleware";

interface notificationType {
  avatar: string;
  title: string;
  subtitle: string;
}

const notifications: notificationType[] = [
  {
    avatar: "/images/profile/user-1.jpg",
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {
    avatar: "/images/profile/user-2.jpg",
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    avatar: "/images/profile/user-3.jpg",
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    avatar: "/images/profile/user-4.jpg",
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
  {
    avatar: "/images/profile/user-1.jpg",
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {
    avatar: "/images/profile/user-2.jpg",
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    avatar: "/images/profile/user-3.jpg",
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    avatar: "/images/profile/user-4.jpg",
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
];

//
// Profile dropdown
//
interface ProfileType {
  href: string;
  title: string;
  subtitle: string;
  icon: any;
}
const profile: ProfileType[] = [
  {
    href: "/theme-pages/account-settings",
    title: "My Profile",
    subtitle: "Account Settings",
    icon: "/images/svgs/icon-account.svg",
  },
  /*{
    href: "/apps/email",
    title: "My Inbox",
    subtitle: "Messages & Emails",
    icon: "/images/svgs/icon-inbox.svg",
  },
  {
    href: "/apps/notes",
    title: "My Tasks",
    subtitle: "To-do and Daily Tasks",
    icon: "/images/svgs/icon-tasks.svg",
  },*/
];

// apps dropdown

interface appsLinkType {
  href: string;
  title: string;
  subtext: string;
  avatar: string;
}

const appsLink: appsLinkType[] = [
  {
    href: "/",
    title: "Dashboard App",
    subtext: "Checking webtoon statistics",
    avatar: "/images/svgs/icon-pie.svg",
  },
  {
    href: "/apps/webtoon-list",
    title: "Webtoon list",
    subtext: "View analyzed webtoon lists",
    avatar: "/images/svgs/icon-dd-application.svg",
  },
  {
    href: "/forms/webtoon-analyze-request",
    title: "Webtoon analyze request",
    subtext: "Webtoon analysis request",
    avatar: "/images/svgs/icon-dd-message-box.svg",
  },
  {
    href: "/apps/webtoon-daliy/naver",
    title: "Daliy webtoon list",
    subtext: "Get daliy webtoons",
    avatar: "/images/svgs/icon-dd-date.svg",
  },
    /*
  {
    href: "/apps/contacts",
    title: "Contact Application",
    subtext: "2 Unsaved Contacts",
    avatar: "/images/svgs/icon-dd-mobile.svg",
  },
  {
    href: "/apps/tickets",
    title: "Tickets App",
    subtext: "Submit tickets",
    avatar: "/images/svgs/icon-dd-lifebuoy.svg",
  },
  {
    href: "/apps/email",
    title: "Email App",
    subtext: "Get new emails",
    avatar: "/images/svgs/icon-dd-message-box.svg",
  },
  {
    href: "/apps/blog/post",
    title: "Blog App",
    subtext: "added new blog",
    avatar: "/images/svgs/icon-dd-application.svg",
  },
  */
];

interface LinkType {
  href: string;
  title: string;
}

const pageLinks: LinkType[] = [
  {
    href: "/",
    title: "Main Dashboard",
  },
  {
    href: "/apps/webtoon-list",
    title: "Webtoon list",
  },
  {
    href: "/forms/webtoon-analyze-request",
    title: "Webtoon analyze request",
  },
  {
    href: "/apps/webtoon-daliy/naver",
    title: "Daily webtoon list",
  },
  {
    href: "/theme-pages/account-settings",
    title: "Account settings",
  },
  {
    href: "/auth/auth1/logoff",
    title: "Log out",
  },
];

export { notifications,  profile, pageLinks, appsLink };
