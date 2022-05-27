import { setVisibilityFilter } from "@/store/actions"
import Link from "@/components/Link"
import { connect } from "react-redux"

const mapStateToProps = (state: any, ownProps: any) => {
    return {
        active: state.visibilityFilter === ownProps.filter
    }
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return {
        onClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter));
        }
    }
};

const FilterLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(Link);

export default FilterLink;