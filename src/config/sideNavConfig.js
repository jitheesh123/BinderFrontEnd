import { checkPermission } from "./utils";

export const sideNavConfig = () => {
    let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;
    let view_only_surveyor = localStorage.getItem("view_only_surveyor") && localStorage.getItem("view_only_surveyor") === "true" ? true : false;

    return [
        {
            key: "dashboard",
            label: "Dashboard",
            url: "dashboard",
            permission: checkPermission("menu", "dashboard", null) && !audit_mode,
            image: "/images/Dashboard.svg",
            hasSubMenu: false
        },
        {
            key: "logbooksmain",
            label: "Logbooks",
            url: "logbooksmain",
            permission: checkPermission("menu", "logbooks", null) || view_only_surveyor,
            image: "/images/user.svg",
            hasSubMenu: false
        },
        {
            key: "reports",
            label: "Reports",
            url: null,
            permission: checkPermission("menu", "reports", null) && !audit_mode,
            image: "/images/Report.svg",
            hasSubMenu: true,
            subMenus: [
                {
                    key: "thresholdStart",
                    label: "Threshold Start",
                    url: "reports/thresholdStart",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "thresholdMiddle",
                    label: "Threshold Middle",
                    url: "reports/thresholdMiddle",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "dueNextDay",
                    label: "Due Next Day",
                    url: "reports/dueNextDay",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "dueToday",
                    label: "Due Today",
                    url: "reports/dueToday",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "threshold3DayeEnd",
                    label: "Threshold 3 Day End",
                    url: "reports/threshold3DayeEnd",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "thresholdWindow",
                    label: "Threshold Window",
                    url: "reports/thresholdWindow",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "currentWeek",
                    label: "Current Week",
                    url: "reports/currentWeek",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "nextWeek",
                    label: "Next Week",
                    url: "reports/nextWeek",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "nextMonth",
                    label: "Next Month",
                    url: "reports/nextMonth",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "completed",
                    label: "Completed",
                    url: "reports/completed",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "overDue",
                    label: "Over Due",
                    url: "reports/overDue",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "incomplete",
                    label: "Incomplete",
                    url: "reports/incomplete",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "nonCompliant",
                    label: "Non-Compliant",
                    url: "reports/nonCompliant",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "trailingViewReport",
                    label: "Trailing View Report",
                    url: "reports/trailingViewReport",
                    permission: true,
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "userSession",
                    label: "User Session",
                    url: null,
                    permission: true,
                    image: null,
                    hasSubMenu: true,
                    subMenus: [
                        {
                            key: "userActivityLog",
                            label: "User Activity Log",
                            url: "comingSoon",
                            permission: true,
                            image: null,
                            hasSubMenu: false
                        }
                    ]
                }
            ]
        },
        {
            key: "scheduling",
            label: "Scheduling",
            url: null,
            permission: checkPermission("menu", "scheduling", null),
            image: "/images/schedule-icon.svg",
            hasSubMenu: true,
            subMenus: [
                {
                    key: "define_building_activity_schedule",
                    label: "Define Building Activity Schedule",
                    url: "buildingActivities",
                    permission: checkPermission("menu", "scheduling", "define_building_activity_schedule"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "edit_building_activity_properties",
                    label: "Edit Building Activity Properties",
                    url: "allActivityCalendar",
                    permission: checkPermission("menu", "scheduling", "edit_building_activity_properties"),
                    image: null,
                    hasSubMenu: false
                }
            ]
        },
        {
            key: "settings",
            label: "Settings",
            url: null,
            permission: checkPermission("menu", "settings", null) && !audit_mode,
            image: "/images/setting.svg",
            hasSubMenu: true,
            subMenus: [
                {
                    key: "consultancies",
                    label: "Consultancies",
                    url: "consultancies",
                    permission: checkPermission("menu", "settings", "consultancies"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "clients",
                    label: "Clients",
                    url: "clients",
                    permission: checkPermission("menu", "settings", "clients"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "sectors",
                    label: "Sectors",
                    url: "sectors",
                    permission: checkPermission("menu", "settings", "sectors"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "campuses",
                    label: "Campuses",
                    url: "campuses",
                    permission: checkPermission("menu", "settings", "campuses"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "buildings",
                    label: "Buildings",
                    url: "buildings",
                    permission: checkPermission("menu", "settings", "buildings"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "floors",
                    label: "Floors",
                    url: "floors",
                    permission: checkPermission("menu", "settings", "floors"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "assets",
                    label: "Assets",
                    url: "assets",
                    permission: checkPermission("menu", "settings", "assets"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "asset_conditions",
                    label: "Asset Conditions",
                    url: "assetConditions",
                    permission: checkPermission("menu", "settings", "asset_conditions"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "master_logbooks",
                    label: "Logbooks",
                    url: "logbooks",
                    permission: checkPermission("menu", "settings", "master_logbooks"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "activities",
                    label: "Activities",
                    url: "activities",
                    permission: checkPermission("menu", "settings", "activities"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "procedures",
                    label: "Procedures",
                    url: "procedures",
                    permission: checkPermission("menu", "settings", "procedures"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "forms",
                    label: "Forms",
                    url: "forms",
                    permission: checkPermission("menu", "settings", "forms"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "deeming_agencies",
                    label: "Deeming Agencies",
                    url: "deeming_agencies",
                    permission: checkPermission("menu", "settings", "deeming_agencies"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "frequencies",
                    label: "Frequencies",
                    url: "frequencies",
                    permission: checkPermission("menu", "settings", "frequencies"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "users",
                    label: "Users",
                    url: "users",
                    permission: checkPermission("menu", "settings", "users"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "user_permissions",
                    label: "User Permissions",
                    url: "userpermissions",
                    permission: checkPermission("menu", "settings", "user_permissions"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "templates",
                    label: "Templates",
                    url: "templates",
                    permission: checkPermission("menu", "settings", "templates"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "notifications",
                    label: "Notifications",
                    url: "notifications",
                    permission: checkPermission("menu", "settings", "notifications"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "building_types",
                    label: "Building Types",
                    url: "building_types",
                    permission: checkPermission("menu", "settings", "building_types"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "form_types",
                    label: "Form Types",
                    url: "form_types",
                    permission: checkPermission("menu", "settings", "form_types"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "email_logs",
                    label: "Emails",
                    url: "emails/inbox",
                    permission: checkPermission("menu", "settings", "email_logs"),
                    image: null,
                    hasSubMenu: false
                },
                {
                    key: "documents",
                    label: "Uploaded Documents",
                    url: "Document",
                    permission: checkPermission("menu", "settings", "documents"),
                    image: null,
                    hasSubMenu: false
                }
            ]
        }
    ];
};
