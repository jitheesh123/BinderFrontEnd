import React, { Component } from "react";
import ReactPaginate from "react-paginate";

class Pagination extends Component {
    componentDidMount = () => {};

    render() {
        const { paginationParams, handlePageClick, handlePerPageChange, isRecordPerPage = false } = this.props;
        return (
            <div className={`fot-nav ${!isRecordPerPage ? "justify-content-end" : ""}`}>
                {isRecordPerPage ? (
                    <div className="count d-flex col-md-6">
                        <div className="count-dtl">
                            Total Count: <span>{paginationParams.totalCount}</span>
                        </div>
                        <div className="col-md-2 pr-2 selbx">
                            <select className="form-control" value={paginationParams.perPage} onChange={e => handlePerPageChange(e)}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="150">150</option>
                            </select>
                        </div>
                    </div>
                ) : null}
                <ReactPaginate
                    previousLabel={"Prev"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    breakClassName={"cursor-pointer"}
                    pageCount={paginationParams.totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagnation"}
                    subContainerClassName={"cursor-pointer"}
                    activeClassName={"active"}
                    activeLinkClassName={"active"}
                    forcePage={paginationParams.currentPage}
                    pageClassName={"cursor-pointer"}
                    previousLinkClassName={"prv"}
                    nextClassName={"nxt"}
                />
            </div>
        );
    }
}

export default Pagination;
