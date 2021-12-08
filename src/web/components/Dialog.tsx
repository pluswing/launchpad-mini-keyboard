export const Dialog = ({children, show}: {children: JSX.Element, show: boolean}): JSX.Element => {
    const modalAreaStyle = show ? "visible opacity-100" : "hidden opacity-0"
    return (
        <div className="modal_wrap">
            <section className={`fixed z-10 top-0 left-0 w-full h-full ${modalAreaStyle}`}>
                <div className="w-full h-full bg-black opacity-90"></div>
                <div className="rounded-lg absolute max-w-lg p-8 bg-gray-100 top-1/2 left-1/2" style={{transform: "translate(-50%,-50%)"}}>
                    <div className="modalContents">
                        {children}
                        <button className="rounded-full absolute bg-gray-100" style={{top: -12, right: -12}}>
                            <svg className="h-8 w-8 text-black" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                </div>
            </section>
      </div>
    );
  };
