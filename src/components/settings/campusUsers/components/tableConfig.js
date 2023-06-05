export const campusUserTableData = {
    keys: [
        "code",
        "name",
        "first_name",
        "last_name",
        "printed_name",
        "email",
        "consultancy",
        "role",
        "title",
        "department",
        "work_phone",
        "cell_phone",
        "building_name",
        "room_number",
        "room_name",
        "city",
        "location",
        "state",
        "zip_code",
        "address",
        "emergency_contact_no",
        "emergency_contact_name",
        "notes",
        "last_seen_at",
        "created_at",
        "updated_at"
    ],
    config: {
        code: {
            isVisible: true,
            label: "Code",
            class: "reg-name",
            searchKey: "users.code",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "code"
        },
        name: {
            isVisible: true,
            label: "User Name",
            class: "reg-name",
            searchKey: "users.name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "name"
        },
        first_name: {
            isVisible: true,
            label: "First Name",
            class: "reg-name",
            searchKey: "users.first_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "first_name"
        },
        last_name: {
            isVisible: true,
            label: "Last Name",
            class: "reg-name",
            searchKey: "users.last_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "last_name"
        },
        printed_name: {
            isVisible: true,
            label: "Printed Name",
            class: "reg-name",
            searchKey: "users.printed_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "printed_name"
        },
        email: {
            isVisible: true,
            label: "Email",
            class: "",
            searchKey: "users.email",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "email"
        },
        last_seen_at: {
            isVisible: true,
            label: "Last Seen",
            class: "",
            searchKey: "users.last_seen_at",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "last_seen_at"
        },
        role: {
            isVisible: true,
            label: "Role",
            class: "",
            searchKey: "roles.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "role",
            commonSearchKey: "roles",
            commonSearchObjectKey: "name"
        },
        group: {
            isVisible: true,
            label: "Group",
            class: "",
            searchKey: "groups.name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "groups",
            commonSearchKey: "groups",
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
        title: {
            isVisible: true,
            label: "Title",
            class: "",
            searchKey: "users.title",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "title"
        },
        work_phone: {
            isVisible: true,
            label: "Work Phone",
            class: "reg-name",
            searchKey: "users.work_phone",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "work_phone"
        },
        cell_phone: {
            isVisible: true,
            label: "Cell Phone",
            class: "reg-name",
            searchKey: "users.cell_phone",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "cell_phone"
        },
        building_name: {
            isVisible: true,
            label: "Building Name",
            class: "reg-name",
            searchKey: "users.building_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "building_name"
        },
        floor: {
            isVisible: true,
            label: "Floor",
            class: "reg-name",
            searchKey: "users.floor",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "floor"
        },
        room_number: {
            isVisible: true,
            label: "Room Number",
            class: "reg-name",
            searchKey: "users.room_number",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "room_number"
        },
        room_name: {
            isVisible: true,
            label: "Room Name",
            class: "reg-name",
            searchKey: "users.room_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "room_name"
        },
        emergency_contact_no: {
            isVisible: true,
            label: "Emergency Contact Number",
            class: "reg-name",
            searchKey: "users.emergency_contact_no",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "emergency_contact_no"
        },
        emergency_contact_name: {
            isVisible: true,
            label: "Emergency Contact Name",
            class: "reg-name",
            searchKey: "users.emergency_contact_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "emergency_contact_name"
        },
        notes: {
            isVisible: true,
            label: "Notes",
            class: "reg-name",
            searchKey: "users.notes",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "notes"
        },
        department: {
            isVisible: true,
            label: "Department",
            class: "reg-name",
            searchKey: "users.department",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "department"
        },
        credentials: {
            isVisible: true,
            label: "Credentials",
            class: "reg-name",
            searchKey: "users.credentials",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "credentials"
        },
        city: {
            isVisible: true,
            label: "City",
            class: "reg-name",
            searchKey: "users.city",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "city"
        },
        last_sign_in_at: {
            isVisible: true,
            label: "Last Sign in At",
            class: "reg-name",
            searchKey: "users.last_sign_in_at",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "last_sign_in_at"
        },
        last_sign_out_at: {
            isVisible: true,
            label: "Last Sign out At",
            class: "reg-name",
            searchKey: "users.last_sign_out_at",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "last_sign_out_at"
        },
        location: {
            isVisible: true,
            label: "Location",
            class: "reg-name",
            searchKey: "users.location",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "location"
        },
        state: {
            isVisible: true,
            label: "State",
            class: "reg-name",
            searchKey: "users.state",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "state"
        },
        zip_code: {
            isVisible: true,
            label: "Zip Code",
            class: "reg-name",
            searchKey: "users.zip_code",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "zip_code"
        },
        address: {
            isVisible: true,
            label: "Address",
            class: "reg-name",
            searchKey: "users.address",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "address"
        },
        is_active: {
            isVisible: true,
            label: "Is Active",
            class: "reg-name",
            searchKey: "users.is_active",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "is_active"
        },
        is_blocked: {
            isVisible: true,
            label: "Is Blocked",
            class: "reg-name",
            searchKey: "users.is_blocked",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "is_blocked"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "users.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "users.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "campus_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};

export const userTableData = {
    keys: [
        "code",
        "name",
        "first_name",
        "last_name",
        "printed_name",
        "email",
        "consultancy",
        "role",
        "client",
        "permission",
        "title",
        "department",
        "work_phone",
        "cell_phone",
        "building_name",
        "room_number",
        "room_name",
        "city",
        "location",
        "state",
        "zip_code",
        "address",
        "emergency_contact_no",
        "emergency_contact_name",
        "notes",
        "last_seen_at",
        "created_at",
        "updated_at"
    ],
    config: {
        code: {
            isVisible: true,
            label: "Code",
            class: "reg-name",
            searchKey: "users.code",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "code"
        },
        name: {
            isVisible: true,
            label: "User Name",
            class: "reg-name",
            searchKey: "users.name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "name"
        },
        first_name: {
            isVisible: true,
            label: "First Name",
            class: "reg-name",
            searchKey: "users.first_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "first_name"
        },
        last_name: {
            isVisible: true,
            label: "Last Name",
            class: "reg-name",
            searchKey: "users.last_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "last_name"
        },
        printed_name: {
            isVisible: true,
            label: "Printed Name",
            class: "reg-name",
            searchKey: "users.printed_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "printed_name"
        },
        email: {
            isVisible: true,
            label: "Email",
            class: "",
            searchKey: "users.email",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "email"
        },
        last_seen_at: {
            isVisible: true,
            label: "Last Seen",
            class: "",
            searchKey: "users.last_seen_at",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "last_seen_at"
        },
        role: {
            isVisible: true,
            label: "Role",
            class: "",
            searchKey: "roles.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "role",
            commonSearchKey: "roles",
            commonSearchObjectKey: "name"
        },
        permission: {
            isVisible: true,
            label: "User Permission",
            class: "",
            searchKey: "permissions.name",
            type: "object",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: true,
            getListTable: "permission",
            commonSearchKey: "permissions",
            commonSearchObjectKey: "name"
        },
        group: {
            isVisible: true,
            label: "Group",
            class: "",
            searchKey: "groups.name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "groups",
            commonSearchKey: "groups",
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
        title: {
            isVisible: true,
            label: "Title",
            class: "",
            searchKey: "users.title",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "title"
        },
        work_phone: {
            isVisible: true,
            label: "Work Phone",
            class: "reg-name",
            searchKey: "users.work_phone",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "work_phone"
        },
        cell_phone: {
            isVisible: true,
            label: "Cell Phone",
            class: "reg-name",
            searchKey: "users.cell_phone",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "cell_phone"
        },
        building_name: {
            isVisible: true,
            label: "Building Name",
            class: "reg-name",
            searchKey: "users.building_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "building_name"
        },
        floor: {
            isVisible: true,
            label: "Floor",
            class: "reg-name",
            searchKey: "users.floor",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "floor"
        },
        room_number: {
            isVisible: true,
            label: "Room Number",
            class: "reg-name",
            searchKey: "users.room_number",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "room_number"
        },
        room_name: {
            isVisible: true,
            label: "Room Name",
            class: "reg-name",
            searchKey: "users.room_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "room_name"
        },
        emergency_contact_no: {
            isVisible: true,
            label: "Emergency Contact Number",
            class: "reg-name",
            searchKey: "users.emergency_contact_no",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "emergency_contact_no"
        },
        emergency_contact_name: {
            isVisible: true,
            label: "Emergency Contact Name",
            class: "reg-name",
            searchKey: "users.emergency_contact_name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "emergency_contact_name"
        },
        notes: {
            isVisible: true,
            label: "Notes",
            class: "reg-name",
            searchKey: "users.notes",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "notes"
        },
        department: {
            isVisible: true,
            label: "Department",
            class: "reg-name",
            searchKey: "users.department",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "department"
        },
        credentials: {
            isVisible: true,
            label: "Credentials",
            class: "reg-name",
            searchKey: "users.credentials",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "credentials"
        },
        city: {
            isVisible: true,
            label: "City",
            class: "reg-name",
            searchKey: "users.city",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "city"
        },
        last_sign_in_at: {
            isVisible: true,
            label: "Last Sign in At",
            class: "reg-name",
            searchKey: "users.last_sign_in_at",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "last_sign_in_at"
        },
        last_sign_out_at: {
            isVisible: true,
            label: "Last Sign out At",
            class: "reg-name",
            searchKey: "users.last_sign_out_at",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "last_sign_out_at"
        },
        location: {
            isVisible: true,
            label: "Location",
            class: "reg-name",
            searchKey: "users.location",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "location"
        },
        state: {
            isVisible: true,
            label: "State",
            class: "reg-name",
            searchKey: "users.state",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "state"
        },
        zip_code: {
            isVisible: true,
            label: "Zip Code",
            class: "reg-name",
            searchKey: "users.zip_code",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "zip_code"
        },
        address: {
            isVisible: true,
            label: "Address",
            class: "reg-name",
            searchKey: "users.address",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "address"
        },
        is_active: {
            isVisible: true,
            label: "Is Active",
            class: "reg-name",
            searchKey: "users.is_active",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "is_active"
        },
        is_blocked: {
            isVisible: true,
            label: "Is Blocked",
            class: "reg-name",
            searchKey: "users.is_blocked",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "is_blocked"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "users.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "users.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "users",
            commonSearchKey: "users",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};