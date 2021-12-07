export const Dialog = ({children, show}: {children: JSX.Element, show: boolean}): JSX.Element => {
    const modalAreaStyle = {
        position: "fixed" as "fixed",
        "z-index": "10",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transition: ".4s",
        ...show ?
            {
                visibility: "visible" as VisibilityState,
                opacity : 1
            } : {
                visibility: "hidden" as VisibilityState,
                opacity : 0
            }
    }
    const modalBgStyle = {
        width: "100%",
        height: "100%",
        "background-color": "rgba(30,30,30,0.9)",
    }
    const modalWrapperStyle = {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        "max-width": "500px",
        padding: "20px 30px",
        "background-color": "#eeeeee",
    }

    const closeButtonStyle = {
        position: "absolute" as "absolute",
        top: 0,
        right: 0,
    }

    return (

        <div className="modal_wrap">
            <section style={modalAreaStyle}>
                <div style={modalBgStyle}></div>
                <div className="rounded-lg" style={modalWrapperStyle}>
                    <div className="modalContents">
                        {children}
                        <button style={closeButtonStyle}>
                            <svg className="h-8 w-8 text-black"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                </div>
            </section>

      </div>
    );
  };
