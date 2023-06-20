export const Input = ({ label, value, onChange, placeHolder, section, error, name, option }) => {
    return (
        <div className="itm">
            <div className="itm-cnt">
                <div className="form-group">
                    <label className="form-control-placeholder" style={{ color: error ? "red" : null }} htmlFor="f-name">
                        {label} *
                    </label>
                    <input
                        style={{ backgroundColor: "white" }}
                        section={section}
                        value={value}
                        id="text"
                        onChange={onChange}
                        className="form-control"
                        placeholder={placeHolder}
                        list={name}
                        name={name}
                    />
                    {name && option ? (
                        <datalist id={name}>{option?.length && option?.map((item, idex) => <option key={idex} value={item} />)}</datalist>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
export const InputSelect = ({ label, value, onChange, error, options }) => {
    return (
        <div className="itm">
            <div className="itm-cnt">
                <div className="form-group select-group">
                    <label className="form-control-placeholder" style={{ color: error && "red" }} htmlFor="f-name">
                        {label} *
                    </label>
                    <select style={{ backgroundColor: "white" }} className="form-control select" value={value} onChange={onChange}>
                        <option value="">Select</option>
                        {options?.length &&
                            options?.map((item, idex) => (
                                <option key={idex} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
