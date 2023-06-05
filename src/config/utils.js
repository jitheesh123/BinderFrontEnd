export const formatNumber = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatmoney = x => {
    return "$ " + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const thousands_separators = num => {
    let n = num.toString();
    let number = n.split(".");
    number[0] = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return number.join(".");
};

export const checkPermission = (tab, item, subitem) => {
    let user_role = localStorage.getItem("user_role");
    let user_permissions = JSON.parse(localStorage.getItem("user_permissions"));
    if (user_role !== "super_admin") {
        if (tab === "menu") {
            if (!subitem) {
                return user_permissions && user_permissions[tab] && user_permissions[tab][item] ? user_permissions[tab][item].view || false : false;
            } else {
                return (user_permissions && user_permissions[tab] && user_permissions?.[tab]?.[item])?.[subitem]
                    ? user_permissions[tab][item][subitem].view || false
                    : false;
            }
        } else {
            return user_permissions && user_permissions[tab] && user_permissions[tab][item] ? user_permissions[tab][item][subitem] || false : false;
        }
    }
    return true;
};

export const getEntityForUrl = entity => {
    let retVal = entity;
    if (entity[entity.length - 1] === "y") {
        retVal = entity.slice(0, -1) + "ies";
    } else if (entity[entity.length - 1] === "s") {
        retVal = entity;
    } else {
        retVal = entity + "s";
    }
    if (entity === "Smart Report") {
        retVal = "dashboards";
    }
    if (entity === "Template" || entity === "User Permission") {
        retVal = "permissions";
    }
    retVal = retVal.split(" ").join("_").toLowerCase();
    return retVal;
};

export const toggleTooltip = () => {
    const existingScript = document.getElementById("toggleTooltip");
    if (existingScript) {
        existingScript.remove();
    }
    const script = document.createElement("script");
    script.src = "/js/main.js";
    script.id = "toggleTooltip";
    document.body.appendChild(script);
};

export let defaultYearsList = [
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
    "2031",
    "2032",
    "2033",
    "2034",
    "2035",
    "2036",
    "2037",
    "2038",
    "2039",
    "2040"
];

export let yearsListForDD = [
    { id: "2015", name: "2015" },
    { id: "2016", name: "2016" },
    { id: "2017", name: "2017" },
    { id: "2018", name: "2018" },
    { id: "2019", name: "2019" },
    { id: "2020", name: "2020" },
    { id: "2021", name: "2021" },
    { id: "2022", name: "2022" },
    { id: "2023", name: "2023" },
    { id: "2024", name: "2024" },
    { id: "2025", name: "2025" },
    { id: "2026", name: "2026" },
    { id: "2027", name: "2027" },
    { id: "2028", name: "2028" },
    { id: "2029", name: "2029" },
    { id: "2030", name: "2030" },
    { id: "2031", name: "2031" },
    { id: "2032", name: "2032" },
    { id: "2033", name: "2033" },
    { id: "2034", name: "2034" },
    { id: "2035", name: "2035" },
    { id: "2036", name: "2036" },
    { id: "2037", name: "2037" },
    { id: "2038", name: "2038" },
    { id: "2039", name: "2039" },
    { id: "2040", name: "2040" }
];

export const graphDummyData = {
    eventBreakdownData: [
        {
            status: "Non-Compliant",
            count: 0
        },
        {
            status: "Incomplete",
            count: 0
        },
        {
            status: "Overdue",
            count: 0
        },
        {
            status: "In Threshold",
            count: 0
        },
        {
            status: "Completed",
            count: 0
        }
    ],
    completedEventBreakdownData: [
        {
            status: "Completed",
            count: 0
        },
        {
            status: "With Failures",
            count: 0
        },
        {
            status: "Non-Compliant",
            count: 0
        },
        {
            status: "Failed 30 Minute Run",
            count: 0
        },
        {
            status: "failed 10 sec transfer",
            count: 0
        },
        {
            status: "Other Failure",
            count: 0
        },
        {
            status: "Failed 30% Load",
            count: 0
        }
    ],
    IncompletedEventBreakdownData: [
        {
            status: "Incomplete",
            count: 0
        },
        {
            status: "Device",
            count: 0
        },
        {
            status: "Document",
            count: 0
        },
        {
            status: "Failed 30 Minute Run",
            count: 0
        },
        {
            status: "Failed 10 sec transfer",
            count: 0
        },
        {
            status: "Other Failure",
            count: 0
        },
        {
            status: "Failed 30% Load",
            count: 0
        }
    ],
    calenderAnalysisData: [
        {
            report: "Threshold Start",
            count: 0
        },
        {
            report: "Threshold Middle",
            count: 0
        },
        {
            report: "Due Next Day",
            count: 0
        },
        {
            report: "Due Today",
            count: 0
        },
        {
            report: "Threshold 3 Day End",
            count: 0
        },
        {
            report: "Threshold 1 Day End",
            count: 0
        }
    ],
    completedWithFailureData: [
        {
            activity_description: " ",
            activity_tooltip: " ",
            percentage: 0,
            count: 0
        },
        {
            activity_description: "  ",
            activity_tooltip: "  ",
            percentage: 0,
            count: 0
        },
        {
            activity_description: "   ",
            activity_tooltip: "   ",
            percentage: 0,
            count: 0
        },
        {
            activity_description: "    ",
            activity_tooltip: "    ",
            percentage: 0,
            count: 0
        },
        {
            activity_description: "     ",
            activity_tooltip: "     ",
            percentage: 0,
            count: 0
        },
        {
            activity_description: "      ",
            activity_tooltip: "      ",
            percentage: 0,
            count: 0
        }
    ]
};

export const fastTooltips = {
    "warning-green.svg":
        "All the items noted on the solid green activity except: Passed plus failed devices equals total devices and the failed devices is greater than 0.  The ILSM box is checked, and comments are noted in the work order & ILSM comments section.  Correction date is filled out, number corrected is filled out, and the correction document is uploaded and attached to the activity event.",
    "warning-red.svg": "Failed devices are greater than 0 and missing correction date and / or correction documents.",
    "plus-icn-red.svg": "Add Overdue Survey",
    "plus-icn.svg": "Add Survey",
    "hashtag-green.svg":
        "All the items noted on the solid green activity except: Passed plus failed devices do not equal the total devices; however, device count updated box has been checked and comments are noted in the device comments section. If failed devices are greater than 0 then all the items in the “Green Exclamation Point” icon are completed as well.",
    "hashtag-red.svg":
        "Passed plus failed devices do not equal the total devices, or the failed devices do not equal the corrected devices and the device count update box is not checked and no comments were entered in the device comment section.",
    "attach-red.svg": "Document is not loaded",
    "calendar-red.svg": "Actual date is out of threshold window",
    "view-red.svg": "Failed is greater than 0 ILSM BOX is not checked",
    completed:
        "Performed by and number pass / fail has been filled out.  Passed devices equal total devices and the failed devices equals 0.  The date is filled out and within the threshold window.  The document is uploaded and attached to the activity event."
};

export const generatorTooltips = {
    "warning-green.svg":
        "All the items noted on the solid green activity except: Passed plus failed devices equals total devices and the failed devices is greater than 0.  The risk assessment box is checked, and comments are noted in the work order & risk assessment comments section.  Correction date is filled out, correction number is filled out, and correction document is uploaded and attached to the activity event.",
    "warning-red.svg": "Failed devices are greater than 0 and missing correction date and / or correction documents.",
    "plus-icn-red.svg": "Add Overdue Survey",
    "plus-icn.svg": "Add Survey",
    "hashtag-green.svg":
        "All the items noted on the solid green activity except: Passed plus failed devices do not equal the total devices; however, device count updated box has been checked and comments are noted in the device comments section. If failed devices are greater than 0 then all the items in the “Green Exclamation Point” icon are completed as well.",
    "hashtag-red.svg":
        "Passed plus failed devices do not equal the total devices, or the failed devices do not equal the corrected devices and the device count update box is not checked and no comments were entered in the device comment section.",
    "attach-red.svg": "Document is not loaded",
    "calendar-red.svg": "Actual date is out of threshold window",
    "view-red.svg": "Failed is greater than 0 ILSM BOX is not checked",
    "failed-run.svg": "On the monthly generator load test the generator failed to run for 30 minutes (question 1).",
    "corrected-failed-run.svg":
        "The generator load test originally failed to run for 30 minutes; however, a correction date, number correct, and correction document has been uploaded and attached to the activity event. The risk assessment box is checked, and comments are noted in the work order & risk assessment comments section.",
    "failed-transfer.svg": "On the monthly generator load test the generator failed to transfer in less than 10 seconds (Question 2).",
    "corrected-failed-transfer.svg":
        "The generator load test originally failed to transfer in less than 10 seconds; however, a correction date, number correct, and correction document has been uploaded and attached to the activity event. The risk assessment box is checked, and comments are noted in the work order & risk assessment comments section.",
    "failed-load.svg":
        "On the monthly generator load test the generator failed to meet the 30% load requirement (Question 3) and no annual load bank has been performed in the past 12 months.",
    "corrected-failed-load.svg":
        "The generator load test originally failed to meet the 30% load; however, an annual load bank test has been performed in the last 12 months. The risk assessment box is checked, and comments are noted in the work order & risk assessment comments section.",
    "other-failure.svg": "On the monthly generator load test the generator originally failed for All Else Passed;(Question 4).",
    "corrected-other-failure.svg":
        "The generator load test originally failed for All Else Passed; however, a correction date, number correct, and correction document has been uploaded and attached to the activity event. The risk assessment box is checked, and comments are noted in the work order & risk assessment comments section.",
    completed:
        "Performed by and number pass / fail has been filled out.  Passed devices equal total devices and the failed devices equals 0.  The date is filled out and within the threshold window.  The answer to questions 1, 2, 3, and 4, if applicable, is yes.  The document is uploaded and attached to the activity event."
};

export const firedrillsTooltips = {
    "warning-green.svg":
        "All the items noted on the solid green activity except the original drill failed.  Corrected date is filled out and the correction document is uploaded and attached to the activity event.",
    "warning-red.svg": "Original drill failed and missing the correction date and / or correction document.",
    "plus-icn-red.svg": "Add Overdue Survey",
    "plus-icn.svg": "Add Survey",
    "attach-red.svg": "Document is not loaded",
    "calendar-red.svg": "Actual date is out of threshold window",
    "clock-icon.svg": "Actual time is outside shift hours",
    "view-red.svg": "Failed is greater than 0 ILSM BOX is not checked",
    completed:
        "Performed by is filled out.  The result of the drill is pass.  The actual date is filled out and within the threshold window.  The actual time is filled out and is not within an invalid interval time.  The drill document is uploaded and attached to the activity event."
};

export const emptyTooltips = {
    "warning-green.svg": "",
    "warning-red.svg": "",
    "plus-icn-red.svg": "",
    "plus-icn.svg": "",
    "hashtag-green.svg": "",
    "hashtag-red.svg": "",
    "attach-red.svg": "",
    "calendar-red.svg": "",
    "view-red.svg": "",
    "failed-run.svg": "",
    "corrected-failed-run.svg": "",
    "failed-transfer.svg": "",
    "corrected-failed-transfer.svg": "",
    "failed-load.svg": "",
    "corrected-failed-load.svg": "",
    "other-failure.svg": "",
    "corrected-other-failure.svg": "",
    completed: ""
};

export let reportsList = [
    { id: "Threshold Start", name: "Threshold Start" },
    { id: "Threshold Middle", name: "Threshold Middle" },
    { id: "Due Next Day", name: "Due Next Day" },
    { id: "Due Today", name: "Due Today" },
    { id: "Threshold 3 Day End", name: "Threshold 3 Day End" },
    { id: "Threshold 1 Day End", name: "Threshold 1 Day End" }
];
