import { createContext, useReducer } from "react"

export const AppContext = createContext()

const initialState = {
  isLogin: false,
  user: null,
  books: [],
  myBook: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payloadToken);
      return {
        ...state,
        isLogin: true,
        user: {
          id: action.payload.id,
          email: action.payload.email,
          fullName: action.payload.fullName,
          gender: action.payload.gender,
          phone: action.payload.phone,
          role: action.payload.role,
          address: action.payload.address,
        },
      }
    case "USER_LOADED":
      return {
        ...state,
        isLogin: true,
        user: {
          id: action.payload.id,
          email: action.payload.email,
          fullName: action.payload.fullName,
          gender: action.payload.gender,
          phone: action.payload.phone,
          role: action.payload.role,
          address: action.payload.address,
        },
      }
    case "ADD_CART":
      return {
        ...state,
        books: [
          ...state.books,
          {
            ...action.payload,
          },
        ],
      }
    case "REMOVE_CART":
      return {
        ...state,
        books: state.books.filter(
          (book) => book.id !== action.payload.id
        ),
      };
    case "EMPTY_CART":
      return {
        ...state,
        books: []
      };
    case "MY_BOOK_TRUE":
      return {
        ...state,
        myBook: true,
      };
    case "MY_BOOK_FALSE":
      return {
        ...state,
        myBook: false,
      };
    case "AUTH_ERROR":
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        isLogin: false,
      };
    default:
      throw new Error()
  }
}

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  )
}