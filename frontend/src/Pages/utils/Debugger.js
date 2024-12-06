export default class Debugger {
    constructor(name) {
        this.name = name
        this.enabled = true
        this.callStack = []
    }
    enable() {
        this.enabled = true
    }
    disable() {
        this.enabled = false
    }

    push(name) {
        if (!this.enabled) return;
        this.callStack.push(name)
    }
    pop() {
        if (!this.enabled) return;
        this.callStack.pop()
    }
    report(json = false) {
        if (!this.enabled) return;
        console.info("Debugger report")
        console.info("Execution time:")
        console.timeEnd(this.name + " timer")
        console.info("Call stack:")
        this.callStack.forEach((entry) => {
            console.log("-", entry)
        })
        // TODO : add output in JSON format
    }
    /*
        @param {function} codeBlock
    */
    async exec(codeBlock) {
        if (this.enabled){
            try {
                console.time(this.name + " timer")
                await codeBlock()
                console.info(this.name + " execution completed!")
            } catch(error) {
                console.error(this.name + "Fetcher class Debugger caught error: ", error)
                throw error
            } finally {
                this.report()
            }
        } else {
            await codeBlock()
        }
    }
}