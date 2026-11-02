import { LightningElement, api } from 'lwc';
import noDataIllustration from './templates/noDataIllustration.html';
import inlineMessage from './templates/inlineMessage.html';

function reduceErrors(errors) {
    const errorList = Array.isArray(errors) ? errors : [errors];
    const messages = [];

    errorList.forEach((error) => {
        if (!error) return;

        const body = error.body;
        if (Array.isArray(body)) {
            body.forEach((item) => {
                if (item && item.message) messages.push(item.message);
            });
        } else if (body && typeof body === 'object') {
            (body.pageErrors || []).forEach((item) => {
                if (item && item.message) messages.push(item.message);
            });
            Object.keys(body.fieldErrors || {}).forEach((field) => {
                (body.fieldErrors[field] || []).forEach((item) => {
                    if (item && item.message) messages.push(item.message);
                });
            });
            if (body.message) messages.push(body.message);
        } else if (body && typeof body === 'string') {
            messages.push(body);
        } else if (error.message) {
            messages.push(error.message);
        }
    });

    return messages;
}

export default class ErrorPanel extends LightningElement {
    /** Single or array of LDS errors */
    @api errors;
    /** Generic / user-friendly message */
    @api friendlyMessage = 'Error retrieving data';
    /** Type of error message **/
    @api type;

    viewDetails = false;

    get errorMessages() {
        return reduceErrors(this.errors);
    }

    handleShowDetailsClick() {
        this.viewDetails = !this.viewDetails;
    }

    render() {
        if (this.type === 'inlineMessage') return inlineMessage;
        return noDataIllustration;
    }
}
