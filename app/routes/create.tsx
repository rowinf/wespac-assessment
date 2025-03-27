import { useState } from "react";
import { useLocation, useNavigate } from "react-router";


const nicknameValidator = (label: string, minimum: number, maximum: number) => {
    return (value: FormDataEntryValue | null) => {
        // if (!isSubmitted) return '';
        if (value != null && typeof value === 'string') {
            if (value.length < minimum || value.length > maximum) {
                return `${label} must be between ${minimum} and ${maximum} characters`;
            }
            return ''
        }
        return `${label} is required`;
    }
}

const savingsGoalValidator = (label: string, maximum: number) => {
    return (value: FormDataEntryValue | null) => {
        if (value != null && typeof value === 'string') {
            // if (!isSubmitted) return '';
            const numericValue = Number(value);
            if (numericValue > maximum) {
                return `${label} must less than ${maximum}`;
            }
            if (numericValue === 0) {
                return `${label} is required`;
            }
            return ''
        }
        return `${label} is required`;
    }
}

const nicknameValidationMessage = nicknameValidator("Nickname", 5, 30);
const savingsGoalValidationMessage = savingsGoalValidator("Savings Goal", 1000000);

export default () => {
    const navigate = useNavigate()
    const [submitted, setSubmitted] = useState(false);
    const [accountType, setAccountType] = useState('');
    const [errors, setErrors] = useState(new Map());

    const resetError = (key: string, message: string) => {
        if (submitted && message.length === 0) setErrors(prevErrors => { 
            prevErrors.delete(key);
            return new Map(prevErrors);
        })
    }
    return (
        <div className="card">
            <form onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.target as HTMLFormElement);
                const errors = new Map<string, string>();
                const savingsError = savingsGoalValidationMessage(data.get('savingsGoal'));
                if (savingsError && accountType === 'savings') {
                    errors.set('savingsGoal', savingsError);
                }
                const nicknameError = nicknameValidationMessage(data.get('nickname'));
                if (nicknameError) {
                    errors.set('nickname', nicknameError);
                }
                setErrors(errors);
                setSubmitted(true);
                if (errors.size === 0) {
                    const payload = {
                        nickname: data.get('nickname'),
                        accountType: data.get('accountType')
                    }
                    fetch('http://localhost:3000/create-account', {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    }).then(async response => {
                        if (response.status === 201) {
                            navigate('/', {state: 'account-created'});
                        }
                    });
                }
            }}>
                <label className={submitted && errors.has('nickname') ? 'card warn' : ''}>
                    Account nickname 
                    <input type="text" name="nickname" placeholder="e.g. My cash money" 
                        onChange={(event) => resetError('nickname', nicknameValidationMessage(event.target.value))}></input>
                    {submitted && errors.has('nickname') ? <div>{errors.get('nickname')}</div> : null}
                </label>
                <label>
                    Everyday account <input type="radio" name="accountType" id="accountType" value="everyday" onChange={(e) => setAccountType(e.currentTarget.value)} defaultChecked />
                </label>
                <br />
                <label>
                    Savings account <input type="radio" name="accountType" id="accountType" value="savings" onChange={(e) => setAccountType(e.currentTarget.value)} />
                </label>
                <br />
                {accountType === 'savings' ?
                    <label className={submitted && errors.has('savingsGoal') ? 'card warn' : ''}>Savings Goal 
                    <input type="text" name="savingsGoal" placeholder="e.g. $100,000" 
                    onChange={(event) => resetError('savingsGoal', savingsGoalValidationMessage(event.target.value))} />
                        {submitted && errors.has('savingsGoal') ? <div>{errors.get('savingsGoal')}</div> : null}
                    </label>
                    : null}
                <button type="submit">Create</button>
            </form>
        </div>
    );
}
