export const Edit = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}
            onClick={onClick}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
    );
}

export const Trash = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}
            onClick={onClick}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );
}

export const Check = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}
            onClick={()=>{
                onClick && onClick()}}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}

export const Reload = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}
            onClick={onClick}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    );
}

export const Cancel = ({ onClick, dimensions }) => {//x-mark icon....
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}
            onClick={onClick}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

export const EllipsisHorizontal = ({ onClick, hoverColor, dimensions }) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke={`${hoverColor?hoverColor:"currentColor"}`} 
            className={`${dimensions?dimensions:"w-6 h-6"}`}
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" 
            />
        </svg>
    );
}

export const BankNotes = ({ dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
    );
}

export const ChevDown = ({ onClick, dimensions }) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className={`${dimensions?dimensions:"w-6 h-6"} cursor-pointer`}
            onClick={()=>{
                onClick && onClick()}}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

export const ChevUp = ({ onClick, dimensions }) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className={`${dimensions?dimensions:"w-6 h-6"} cursor-pointer`}
            onClick={()=>{
                onClick && onClick()}
            }
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
    );
}

export const Eye = ({onClick, dimensions }) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 stroke-slate-300 cursor-pointer"
            onClick={onClick}    
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

export const EyeSlash = ({ onClick }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 stroke-slate-300 cursor-pointer"
            onClick={onClick}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );
}

export const Plus = ({ onClick, strokeColor }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className={`w-6 h-6 ${strokeColor && strokeColor}`}
            onClick={onClick}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    )
}

export const PlusCircle = ({ onClick, strokeColor, dimensions}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className={`w-6 h-6 ${strokeColor && strokeColor}`}
            onClick={onClick}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

    );
}

export const Minus = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
    );
}

export const MinusCircle = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

export const XCircle = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}
            onClick={onClick}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

    );
}

export const XMark = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

export const ShopingCart = ({ onClick, strokeColor, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${strokeColor && strokeColor} ${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
    );
}

export const Info = ({onClick, dimensions}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
    );
}

export const MagnifyingGlass = ({ onClick, disabled, dimensions }) => {
    return (
        <svg 
            className={`fill-current text-gray-500 ${!disabled && "hover:stroke-gray-700 cursor-pointer"} w-6 h-6`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path 
                className="heroicon-ui"
                d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" 
            />
        </svg>
    );
}

export const ReloadArrow = ({ onClick, dimensions } ) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="cursor-pointer stroke-gray-500 hover:stroke-2 hover:stroke-gray-700  w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>

    );
}

export const Home = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    );
}

export const ShoppingBag = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    );
}

export const UserCircle = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

export const UserPlus = ({ onClick, dimensions }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
    );
}

export const SignOut = ({ onClick, dimensions }) => {//icon name on tailwind source list:arrow on left
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
    );
}

export const SignIn = ({ onClick, dimensions }) => {//icon name on tailwind source list:arrow on right
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
    );
}

export const Programmer = ({ onClick, dimensions }) => {
    return (
        <svg             
            xmlns="http://www.w3.org/2000/svg"      
            viewBox="0 0 102.74 122.88"
            stroke="currentColor"               
            strokeWidth={1.5}
            fill="currentColor"
            className={`${dimensions?dimensions:"w-6 h-6"}`}              
        >
            <g>
                <path 
                    className="st0" 
                    fillRule="evenodd" 
                    clipRule="evenodd" 
                    d="M31.25,37.01c-1.12,0.04-1.96,0.27-2.54,0.66c-0.33,0.22-0.57,0.5-0.73,0.84c-0.17,0.37-0.25,0.83-0.24,1.35 c0.04,1.53,0.85,3.53,2.4,5.83l0.02,0.03l5.03,8c2.02,3.21,4.13,6.48,6.76,8.88c2.53,2.31,5.59,3.87,9.65,3.88 c4.39,0.01,7.6-1.61,10.21-4.05c2.71-2.54,4.85-6.02,6.96-9.49l5.67-9.33c1.06-2.41,1.44-4.02,1.2-4.97 c-0.14-0.56-0.76-0.84-1.82-0.89c-0.22-0.01-0.46-0.01-0.69-0.01c-0.25,0.01-0.52,0.02-0.79,0.05c-0.15,0.01-0.3,0-0.44-0.03 c-0.5,0.03-1.02-0.01-1.55-0.08l1.94-8.59c-14.4,2.27-25.17-8.42-40.39-2.14l1.1,10.12C32.36,37.11,31.78,37.09,31.25,37.01 L31.25,37.01L31.25,37.01L31.25,37.01z M68.07,104.78v4.83l-9.93,5.63v-5.63l6.39-2.43l-6.39-2.4v-5.63L68.07,104.78L68.07,104.78z M50.87,116.83h-4.23l5.22-20.34h4.23L50.87,116.83L50.87,116.83z M43.81,104.78l-6.39,2.4l6.39,2.43v5.63l-9.93-5.63v-4.83 l9.93-5.63V104.78L43.81,104.78z M75.73,35.2L75.73,35.2L75.73,35.2c0.21-8.77,1.82-17.63-4.42-24.82 C66.86,5.25,55.28,0.42,47.77,0.01c-3.17-0.17-1.96,2.41-5.09,3.49c-6.46,2.23-12.11,6.97-13.96,13.55 c-0.3,1.08-0.51,2.17-0.62,3.26c-0.21,4.58-0.09,10.04,0.24,14.38c-0.45,0.17-0.86,0.38-1.22,0.62c-0.78,0.52-1.35,1.2-1.73,2.01 c-0.36,0.77-0.52,1.65-0.49,2.62c0.06,2.06,1.01,4.56,2.85,7.31l5.03,8c1.76,2.8,3.6,5.65,5.84,8.06 c-0.11,0.32,0.01-0.03-0.06,0.18c-0.62,1.88-1.66,5.02-2.59,6.78c-6.11,4-20.1,5.03-25.53,8.06c-14.82,8.26-9.47,25.29-9.65,39.36 c0.29,3.14,2.07,4.94,5.57,5.21h3.79l-4.15-31.5c-0.32-2.45,1.42-4.46,3.56-4.46h19.47h22.98c-0.79-5.1-13.98-10.02-14.45-13.86 c0.13-0.09,0.25-0.21,0.35-0.35c1.12-1.56,2.28-4.81,3.08-7.18c2.83,2.29,6.23,3.79,10.6,3.8c3.92,0.01,7.05-1.08,9.68-2.85 c0.26,0.37,0.52,0.76,0.8,1.17c1.25,1.84,2.71,3.97,4.07,5.49c-0.29,4.37-11.73,4.42-13.03,13.78h40.74c2.14,0,3.89,2.01,3.56,4.46 l-4.15,31.5h3.79c3.5-0.27,5.28-2.07,5.58-5.21c-0.99-13.29,3.99-31.76-9.65-39.36c-5.36-2.99-19.06-4.03-25.29-7.9 c-1.05-1.3-2.18-2.96-3.18-4.42c-0.32-0.48-0.63-0.93-0.92-1.34l0.15-0.13c2.99-2.8,5.24-6.45,7.45-10.09l5.73-9.44 c0.03-0.05,0.06-0.11,0.09-0.16l0,0c1.34-3.05,1.78-5.29,1.38-6.87C78.02,36.51,77.13,35.63,75.73,35.2L75.73,35.2z"/>
            </g>
        </svg>
    );
}

export const ArrowSmallUp = ({dimensions}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${dimensions?dimensions:"w-6 h-6"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
        </svg>
    );
}