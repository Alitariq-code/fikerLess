const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Network diagnostic utilities
class NetworkDiagnostic {
    static async testDNS(hostname) {
        console.log(`🔍 Testing DNS resolution for ${hostname}...`);
        try {
            const { stdout, stderr } = await execAsync(`nslookup ${hostname}`);
            console.log('✅ DNS Resolution successful:');
            console.log(stdout);
            return true;
        } catch (error) {
            console.error('❌ DNS Resolution failed:');
            console.error(error.message);
            return false;
        }
    }

    static async testPing(hostname) {
        console.log(`🏓 Testing ping to ${hostname}...`);
        try {
            const { stdout, stderr } = await execAsync(`ping -c 4 ${hostname}`);
            console.log('✅ Ping successful:');
            console.log(stdout);
            return true;
        } catch (error) {
            console.error('❌ Ping failed:');
            console.error(error.message);
            return false;
        }
    }

    static async testTelnet(hostname, port) {
        console.log(`🔌 Testing telnet connection to ${hostname}:${port}...`);
        try {
            // Use timeout command to limit telnet attempt
            const { stdout, stderr } = await execAsync(`timeout 10 telnet ${hostname} ${port}`);
            console.log('✅ Telnet connection successful');
            return true;
        } catch (error) {
            console.error('❌ Telnet connection failed:');
            console.error('This might indicate firewall blocking or service unavailable');
            return false;
        }
    }

    static async checkInternetConnection() {
        console.log('🌐 Testing general internet connectivity...');
        try {
            const { stdout, stderr } = await execAsync('ping -c 2 8.8.8.8');
            console.log('✅ Internet connection is working');
            return true;
        } catch (error) {
            console.error('❌ No internet connection detected');
            return false;
        }
    }

    static async runFullDiagnostic() {
        console.log('\n🔬 Running Network Diagnostic Suite...');
        console.log('=' .repeat(50));
        
        const results = {};
        
        // Test internet connectivity first
        results.internet = await this.checkInternetConnection();
        
        if (results.internet) {
            // Test MongoDB Atlas hostname
            const mongoHost = 'cluster0.ekjduv5.mongodb.net';
            results.dns = await this.testDNS(mongoHost);
            results.ping = await this.testPing(mongoHost);
            results.telnet = await this.testTelnet(mongoHost, 27017);
        }
        
        console.log('\n📊 Diagnostic Summary:');
        console.log('=' .repeat(30));
        console.log(`Internet: ${results.internet ? '✅' : '❌'}`);
        console.log(`DNS: ${results.dns ? '✅' : '❌'}`);
        console.log(`Ping: ${results.ping ? '✅' : '❌'}`);
        console.log(`MongoDB Port: ${results.telnet ? '✅' : '❌'}`);
        
        if (!results.internet) {
            console.log('\n🚨 CRITICAL: No internet connection detected!');
            console.log('Please check your network connection and try again.');
        } else if (!results.dns) {
            console.log('\n🚨 DNS Issue: Cannot resolve MongoDB hostname');
            console.log('Try using a different DNS server (e.g., 8.8.8.8)');
        } else if (!results.ping) {
            console.log('\n⚠️  Ping failed: Host might be blocking ICMP');
            console.log('This is normal for some cloud services, check telnet result');
        } else if (!results.telnet) {
            console.log('\n🚨 PORT Issue: Cannot connect to MongoDB port 27017');
            console.log('Check firewall settings and IP whitelist in MongoDB Atlas');
        } else {
            console.log('\n✅ All network tests passed! MongoDB should be reachable.');
            console.log('Connection issue might be authentication or configuration related.');
        }
        
        return results;
    }
}

module.exports = NetworkDiagnostic;
