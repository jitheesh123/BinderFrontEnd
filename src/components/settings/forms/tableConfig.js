export const formTableData = {
    keys: ["code", "form_id", "description", "created_at", "updated_at"],
    config: {
        code: {
            isVisible: true,
            label: "Code",
            class: "reg-name",
            searchKey: "forms.code",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "forms",
            commonSearchKey: "forms",
            commonSearchObjectKey: "code"
        },
        form_id: {
            isVisible: true,
            label: "Form Id",
            class: "reg-name",
            searchKey: "forms.procedure_id",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "forms",
            commonSearchKey: "forms",
            commonSearchObjectKey: "name"
        },
        description: {
            isVisible: true,
            label: "Description",
            class: "",
            searchKey: "forms.description",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "forms",
            commonSearchKey: "forms",
            commonSearchObjectKey: "description"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "forms.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "forms",
            commonSearchKey: "forms",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "forms.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "forms",
            commonSearchKey: "forms",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
