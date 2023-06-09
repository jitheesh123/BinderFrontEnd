export const buildingActivityTableData = {
    keys: [
        "building_logbook",
        "building",
        "parent",
        "deeming_agency",
        "deeming_agency_frequency",
        "edit_form",
        "client",
        "consultancy",
        "sector",
        "campus",
        "display_order",
        "standard",
        "standard_tooltip",
        "activity_description",
        "frequency",
        "test_frequency",
        "completion_threshold",
        "email_threshold",
        "start_date",
        "end_date",
        "is_active",
        "shift_start",
        "shift_end",
        "created_at",
        "updated_at"
    ],
    config: {
        code: {
            isVisible: true,
            label: "Code",
            class: "",
            searchKey: "building_activities.code",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "code"
        },
        parent: {
            isVisible: true,
            label: "Parent",
            class: "",
            searchKey: "building_activities.parent",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "parent"
        },
        deeming_agency_frequency: {
            isVisible: true,
            label: "DA Frequency",
            class: "",
            searchKey: "deeming_agency_frequencies.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "deeming_agency_frequency",
            commonSearchKey: "deeming_agency_frequencies",
            commonSearchObjectKey: "name"
        },
        is_active: {
            isVisible: true,
            label: "Is Active?",
            class: "",
            searchKey: "building_activities.is_active",
            type: "boolean",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "is_active"
        },
        calculate_next_event: {
            isVisible: true,
            label: "Calculate Next Event?",
            class: "",
            searchKey: "activities.calculate_next_event",
            type: "boolean",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "activities",
            commonSearchKey: "activities",
            commonSearchObjectKey: "calculate_next_event"
        },
        schedule_threshold: {
            isVisible: true,
            label: "Schedule Threshold",
            class: "",
            searchKey: "building_activities.schedule_threshold",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "schedule_threshold"
        },
        activity_type: {
            isVisible: true,
            label: "Activity Type",
            class: "",
            searchKey: "building_activities.activity_type",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "activity_type"
        },
        building_logbook: {
            isVisible: true,
            label: "Logbook",
            class: "",
            searchKey: "building_logbooks.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "name"
        },
        client: {
            isVisible: true,
            label: "Client",
            class: "",
            searchKey: "clients.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "clients",
            commonSearchKey: "clients",
            commonSearchObjectKey: "name"
        },
        consultancy: {
            isVisible: true,
            label: "Consultancy",
            class: "",
            searchKey: "consultancies.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "consultancies",
            commonSearchKey: "consultancies",
            commonSearchObjectKey: "name"
        },
        sector: {
            isVisible: true,
            label: "Sector",
            class: "",
            searchKey: "sectors.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "sector",
            commonSearchKey: "sectors",
            commonSearchObjectKey: "name"
        },
        campus: {
            isVisible: true,
            label: "Campus",
            class: "region-wid",
            searchKey: "campus.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "campuses",
            commonSearchKey: "campuses",
            commonSearchObjectKey: "name"
        },
        building: {
            isVisible: true,
            label: "Building",
            class: "build",
            searchKey: "buildings.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "",
            commonSearchKey: "",
            commonSearchObjectKey: "",
            item: 4
        },
        deeming_agency: {
            isVisible: true,
            label: "Deeming Agency",
            class: "",
            searchKey: "deeming_agencies.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "deeming_agency",
            commonSearchKey: "deeming_agencies",
            commonSearchObjectKey: "name"
        },
        // deeming_agency: {
        //     isVisible: true,
        //     label: "Deeming Agency",
        //     class: "",
        //     searchKey: "deeming_agencies.name",
        //     type: "object",
        //     hasWildCardSearch: true,
        //     hasSort: true,
        //     hasCommonSearch: true,
        //     getListTable: "deeming_agency",
        //     commonSearchKey: "deeming_agencies",
        //     commonSearchObjectKey: "name"
        // },
        display_order: {
            isVisible: true,
            label: "Display Order",
            class: "",
            searchKey: "building_activities.display_order",
            type: "float",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "display_order"
        },
        standard: {
            isVisible: true,
            label: "Standard",
            class: "",
            searchKey: "building_activities.standard",
            type: "window",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "standard"
        },
        standard_tooltip: {
            isVisible: true,
            label: "standard Tooltip",
            class: "",
            searchKey: "building_activities.standard_tooltip",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "standard_tooltip"
        },
        activity_description: {
            isVisible: true,
            label: "Activity Description",
            class: "",
            searchKey: "building_activities.activity_description",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "activity_description"
        },
        activity_text: {
            isVisible: true,
            label: "Activity text",
            class: "",
            searchKey: "building_activities.activity_text",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "activity_text"
        },
        activity_tooltip: {
            isVisible: true,
            label: "Activity Tooltip",
            class: "",
            searchKey: "building_activities.activity_tooltip",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "activity_tooltip"
        },
        interval_type: {
            isVisible: true,
            label: "Interval Type",
            class: "",
            searchKey: "building_activities.interval_type",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "interval_type"
        },
        frequency: {
            isVisible: true,
            label: "Frequency",
            class: "",
            searchKey: "building_activities.frequency",
            type: "rrule",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "frequency"
        },
        test_frequency: {
            isVisible: true,
            label: "Test Frequency",
            class: "",
            searchKey: "building_activities.test_frequency",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "test_frequency"
        },
        completion_threshold: {
            isVisible: true,
            label: "Completion Threshold",
            class: "",
            searchKey: "building_activities.completion_threshold",
            type: "number",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "completion_threshold"
        },
        email_threshold: {
            isVisible: true,
            label: "Email Threshold",
            class: "",
            searchKey: "building_activities.email_threshold",
            type: "number",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "code"
        },
        code_reference: {
            isVisible: true,
            label: "Code Reference",
            class: "",
            searchKey: "building_activities.code_reference",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "code_reference"
        },
        code_reference_tooltip: {
            isVisible: true,
            label: "Code Reference Tooltip",
            class: "",
            searchKey: "building_activities.code_reference_tooltip",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "code_reference_tooltip"
        },
        quarterly_view: {
            isVisible: true,
            label: "Quarterly View",
            class: "",
            searchKey: "building_activities.quarterly_view",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "quarterly_view"
        },
        edit_form: {
            isVisible: true,
            label: "Event Form",
            class: "",
            searchKey: "building_activities.edit_form",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "edit_form"
        },
        default_total_devices: {
            isVisible: true,
            label: "Default Total Devices",
            class: "",
            searchKey: "building_activities.default_total_devices",
            type: "number",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "default_total_devices"
        },
        start_date: {
            isVisible: true,
            label: "Valid From",
            class: "",
            searchKey: "building_activities.start_date",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "start_date"
        },
        end_date: {
            isVisible: true,
            label: "Valid To",
            class: "",
            searchKey: "building_activities.end_date",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "end_date"
        },
        shift_start: {
            isVisible: true,
            label: "Shift Start",
            class: "",
            searchKey: "building_activities.shift_start",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "shift_start"
        },
        shift_end: {
            isVisible: true,
            label: "Shift End",
            class: "",
            searchKey: "building_activities.shift_end",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "shift_end"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "building_activities.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "building_activities.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "building_activities",
            commonSearchKey: "building_activities",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};