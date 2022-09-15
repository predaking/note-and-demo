import { VisibilityFilters } from "@/common/constant";
import { TodoProps, TodoListProps } from "@/common/interface";
import { toggleTodo } from "@/store/actions";
import { connect } from "react-redux";
import TodoList from "@/components/TodoList";

const { SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED } = VisibilityFilters;

const getVisibleTodos = (todos: TodoProps[], filter: string) => {
    switch (filter) {
        case SHOW_COMPLETED:
            return todos.filter(item => item.completed);
        case SHOW_ACTIVE:
            return todos.filter(item => !item.completed);
        case SHOW_ALL:
        default:
            return todos;
    }
};

const mapStateToProps = ({ todos }: TodoListProps, props: any) => {
    return {
        todos: getVisibleTodos(todos, props.filter)
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onTodoClick: (id: number) => dispatch(toggleTodo(id))
    }
};

const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoList);

export default VisibleTodoList;