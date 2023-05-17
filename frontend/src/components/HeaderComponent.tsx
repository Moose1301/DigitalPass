import { cookies } from 'next/headers';
import { Component } from 'react';
import { isLoggedIn } from '~/utils/UserUtils';


export default class HeaderComponent extends Component {
    
    render() {

        const loggedIn: boolean = false;
        if (!loggedIn) {
            return (
                <div className={`fixed w-full h-16 flex justify-between transition-all`}>
                    <button>Login</button>
                </div>
            );
        }
        return (
            <div className={`fixed w-full h-16 flex justify-between transition-all`}>

            </div>
        )
    }
} 