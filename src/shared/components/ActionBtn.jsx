import React from 'react'

const ActionBtn = ({ onClick, title, danger, light, children }) => {

    if (light) {
        return (
            <button
                onClick={onClick}
                title={title}
                className={`
                    flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                    bg-white/15 border border-white/25 text-white
                    hover:bg-white/30 active:scale-95 transition-all shrink-0
                    ${danger ? 'hover:bg-red-500/40 hover:border-red-300/50' : ''}
                `}
            >
                {children}
            </button>
        );
    }
    return (
        <button
            onClick={onClick}
            title={title}
            className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shrink-0 active:scale-95
                ${danger
                    ? 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }
            `}
        >
            {children}
        </button>
    );
}

export default ActionBtn