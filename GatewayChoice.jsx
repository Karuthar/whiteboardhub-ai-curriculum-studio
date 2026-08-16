import "./GatewayChoice.css";

export default function GatewayChoice({ onGuest, onRegister }) {

    return (

        <div className="gateway-choice">

            <div className="gateway-card">

                <h2>Continue</h2>

                <p>
                    Generate documents instantly or create your WhiteBoard account.
                </p>

                <button onClick={onGuest}>
                    Continue as Guest
                </button>

                <button onClick={onRegister}>
                    Register / Login
                </button>

                <small>
                    Registered users automatically save projects, earn from document sales,
                    sync across devices and access the Marketplace.
                </small>

            </div>

        </div>

    );

}