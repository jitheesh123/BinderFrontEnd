export const consultancyTableData = {
    keys: ["code", "name", "comments", "image", "created_at", "updated_at"],
    config: {
        code: {
            isVisible: true,
            label: "Consultancy Code",
            class: "",
            searchKey: "consultancies.code",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "consultancies",
            commonSearchKey: "consultancies",
            commonSearchObjectKey: "code"
        },
        name: {
            isVisible: true,
            label: "Consultancy Name",
            class: "reg-name",
            searchKey: "consultancies.name",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "consultancies",
            commonSearchKey: "consultancies",
            commonSearchObjectKey: "name"
        },
        comments: {
            isVisible: true,
            label: "Comments",
            class: "",
            searchKey: "consultancies.comments",
            type: "string",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "consultancy",
            commonSearchKey: "consultancies",
            commonSearchObjectKey: "comments"
        },
        image: {
            isVisible: false,
            label: "Image",
            class: "",
            searchKey: "consultancies.image",
            type: "image",
            hasWildCardSearch: false,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "consultancy",
            commonSearchKey: "consultancies",
            commonSearchObjectKey: "image"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "consultancies.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "consultancies",
            commonSearchKey: "consultancies",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "consultancies.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasSort: true,
            hasCommonSearch: false,
            getListTable: "consultancies",
            commonSearchKey: "consultancies",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};