import { useReducer } from 'react';
import './App.css';
/*

 Exempel med useReducer och ett enkelt bankkonto!

- Använder en reducerfunktion för att modellera följande states: öppna konto, sätta in, ta ut, begära lån, betala lån, stänga konto. 
- Alla operationer (förutom att öppna konto) kan endast utföras om isActive är sant. Om inte, returnera bara det ursprungliga state-objektet. 
  Detta kontrolleras direkt i början av reducern.
- När kontot öppnas sätts isActive till sant. Det finns också ett minsta insättningsbelopp på 500 för att öppna ett konto (vilket betyder att 
  saldot kommer att börja på 500).
- Kunden kan endast begära ett lån om det inte finns något lån ännu. Om det villkoret är uppfyllt registreras det begärda beloppet i loan-staten, 
  och det läggs till saldot. Om villkoret inte är uppfyllt, returnera bara det aktuella state.
- När kunden betalar lånet händer motsatsen: pengarna tas från saldot och loan kommer tillbaka till 0. Detta kan leda till negativa saldon, 
  men det är inget problem eftersom kunden inte kan stänga sitt konto nu (se nästa punkt).
- Kunden kan bara stänga ett konto om det inte finns något lån OCH om saldot är noll. Om detta villkor inte är uppfyllt, returnera bara state. 
  Om villkoret är uppfyllt avaktiveras kontot och alla pengar tas ut. Kontot går tillbaka till sitt initiala tillstånd.
*/

// Define initial bank state interface
interface inititalBankState {
  balance: number;
  loan: number;
  isActive: boolean;
}

// Define bank state interface
interface BankState {
  isActive: boolean; //!  Behövs denna rad här???
  balance: number;
  loan: number;
}

//* Define bank action types with "Type Union", i.e the | in front of every object"
// This TypeScript code defines a type BankAction which represents various actions that can be
// dispatched within a banking application. Each action is represented by an object with a type property
// indicating the action type, and optionally a payload property providing additional data related to the action.
type BankAction =
  | { type: 'openAccount' }
  | { type: 'deposit'; payload: number }
  | { type: 'withdraw'; payload: number }
  | { type: 'requestLoan'; payload: number }
  | { type: 'payLoan' }
  | { type: 'closeAccount' };

// Define initial state for the bank
const initialState: inititalBankState = {
  balance: 0,
  loan: 0,
  isActive: true,
};

// Define reducer function for bank actions
function reducer(state: BankState, action: BankAction): BankState {
  if (!state.isActive && action.type !== 'openAccount') return state; // Check if the account is inactive and the action is not 'openAccount'

  switch (
    action.type // Handle different action types
  ) {
    case 'openAccount':
      return {
        // Open account action
        ...state,
        balance: 500,
        isActive: true,
      };
    case 'deposit':
      return { ...state, balance: state.balance + action.payload! }; // Deposit action
    case 'withdraw':
      return { ...state, balance: state.balance - action.payload! }; // Withdraw action
    case 'requestLoan':
      if (state.loan > 0) return state; // Request loan action
      return {
        ...state,
        loan: action.payload!,
        balance: state.balance + action.payload!,
      };
    case 'payLoan':
      return { ...state, loan: 0, balance: state.balance - state.loan }; // Pay loan action
    case 'closeAccount':
      if (state.loan > 0 || state.balance !== 0) return state; // Close account action
      return initialState;
    default:
      throw new Error('Unkown'); // Throw error for unknown action types
  }
}

// Export the App component
export default function App() {
  // Use reducer to manage bank state
  const [{ balance, loan, isActive }, dispatch] = useReducer(reducer, initialState);

  // Render the App component
  return (
    <div className='App'>
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>
      <p>
        <button onClick={() => dispatch({ type: 'openAccount' })} disabled={isActive}>
          Open account
        </button>
      </p>
      <p>
        <button onClick={() => dispatch({ type: 'deposit', payload: 150 })} disabled={!isActive}>
          Deposit 150
        </button>
      </p>
      <p>
        <button onClick={() => dispatch({ type: 'withdraw', payload: 50 })} disabled={!isActive}>
          Withdraw 50
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: 'requestLoan', payload: 5000 })}
          disabled={!isActive}
        >
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button onClick={() => dispatch({ type: 'payLoan' })} disabled={!isActive}>
          Pay loan
        </button>
      </p>
      <p>
        <button onClick={() => dispatch({ type: 'closeAccount' })} disabled={!isActive}>
          Close account
        </button>
      </p>
    </div>
  );
}

//todo Initial code, without comments. ----------------------------------------------
// interface inititalBankState {
//   balance: number;
//   loan: number;
//   isActive: boolean;
// }

// interface BankState {
//   isActive: boolean;
//   balance: number;
//   loan: number;
// }

// type BankAction =
//   | { type: 'openAccount' }
//   | { type: 'deposit'; payload: number }
//   | { type: 'withdraw'; payload: number }
//   | { type: 'requestLoan'; payload: number }
//   | { type: 'payLoan' }
//   | { type: 'closeAccount' };

// const initialState: inititalBankState = {
//   balance: 0,
//   loan: 0,
//   isActive: false,
// };

// function reducer(state: BankState, action: BankAction): BankState {
//   if (!state.isActive && action.type !== 'openAccount') return state;

//   switch (action.type) {
//     case 'openAccount':
//       return {
//         ...state,
//         balance: 500,
//         isActive: true,
//       };
//     case 'deposit':
//       return { ...state, balance: state.balance + action.payload! };
//     case 'withdraw':
//       return { ...state, balance: state.balance - action.payload! };
//     case 'requestLoan':
//       if (state.loan > 0) return state;
//       return {
//         ...state,
//         loan: action.payload!,
//         balance: state.balance + action.payload!,
//       };
//     case 'payLoan':
//       return { ...state, loan: 0, balance: state.balance - state.loan };
//     case 'closeAccount':
//       if (state.loan > 0 || state.balance !== 0) return state;
//       return initialState;
//     default:
//       throw new Error('Unkown');
//   }
// }

// export default function App() {
// const [{ balance, loan, isActive }, dispatch] = useReducer(
//   reducer,
//   initialState
// );

//   return (
//     <div className='App'>
//       <h1>useReducer Bank Account</h1>
//       <p>Balance: {balance}</p>
//       <p>Loan: {loan}</p>
//       <p>
//         <button
//           onClick={() => dispatch({ type: 'openAccount' })}
//           disabled={isActive}
//         >
//           Open account
//         </button>
//       </p>
//       <p>
//         <button
//           onClick={() => dispatch({ type: 'deposit', payload: 150 })}
//           disabled={!isActive}
//         >
//           Deposit 150
//         </button>
//       </p>
//       <p>
//         <button
//           onClick={() => dispatch({ type: 'withdraw', payload: 50 })}
//           disabled={!isActive}
//         >
//           Withdraw 50
//         </button>
//       </p>
//       <p>
//         <button
//           onClick={() => dispatch({ type: 'requestLoan', payload: 5000 })}
//           disabled={!isActive}
//         >
//           Request a loan of 5000
//         </button>
//       </p>
//       <p>
//         <button
//           onClick={() => dispatch({ type: 'payLoan' })}
//           disabled={!isActive}
//         >
//           Pay loan
//         </button>
//       </p>
//       <p>
//         <button
//           onClick={() => dispatch({ type: 'closeAccount' })}
//           disabled={!isActive}
//         >
//           Close account
//         </button>
//       </p>
//     </div>
//   );
// }
