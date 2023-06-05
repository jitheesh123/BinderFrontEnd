const getImage = type => {
    switch (type) {
        case "sectors":
            return "images/sector-icon.svg";
        case "campus":
            return "images/campus-icon.svg";
        case "clients":
            return "images/clients-icon.svg";
        case "users":
            return "images/users-icon.svg";
        case "buildings":
            return "images/apartment.svg";
        case "notification":
            return "images/notifications.svg";
        default:
            return "images/sector-icon.svg";
    }
};

export default function EntityCount(props) {
    const { countData } = props;

    return (
        <div class="col-xl col-md-6 col-sm-12 col">
            <div class="info-bx">
                <div class="lft">
                    <i>
                        <img src={getImage(countData.entity)} alt="" />
                    </i>
                    <small>{countData.entity}</small>
                </div>
                <div class="rgt">
                    <strong>{countData.count}</strong>
                </div>
            </div>
        </div>
    );
}
