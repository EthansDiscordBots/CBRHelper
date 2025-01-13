export async function retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let retry = 0; retry < maxRetries; retry++) {
        try {
            return await operation();
        } catch (error) {
        //    console.error(`Attempt ${retry + 1} failed:`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    //throw new Error(`Operation failed after ${maxRetries} retries`);
}//

