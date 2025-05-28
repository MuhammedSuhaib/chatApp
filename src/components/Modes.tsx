'use client';
import { useState, useCallback } from "react";

function Modes() {
    // State for theme mode (true = dark, false = light)
    const [isDarkMode, setIsDarkMode] = useState(false);

    //* useCallback: React hook to memoize the function.
    //? MEMOIZE means : Storing the result so you can use it next time instead of calculating the same thing again and again.
    /*
        useCallback(function,   deps)
                    ⬇             ⬇
        useCallback(() => {}, [dep1, dep2]);
    */


    /**
    toggleMode → calls → setIsDarkMode → with → (prevMode) => !prevMode.
    */
    // Toggle mode function
    const toggleMode = useCallback(() => {
        // passing an arrow function as the parameter to setIsDarkMode.
        setIsDarkMode((prevMode) => !prevMode);
    }, []);

    return (<>
    {/* testBar */}
        <div className=" flex justify-center items-center ">
            <div className="sm:bg-amber-200 md:bg-amber-800 h-4 w-[320px] bg-purple-900" />
        </div>
        {/* button */}
        <div
            className={`flex justify-end transition-all  duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                }`}
        >
            <button
                type="button"
                className="px-4 py-2 border rounded-md transition-all duration-300 hover:opacity-80"
                onClick={toggleMode}
            >
                {isDarkMode ? "🌞" : "🌜"}
            </button>
        </div>
    </>
    );
}

export default Modes;
