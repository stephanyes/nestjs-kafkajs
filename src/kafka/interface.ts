import { logLevel, Mechanism, SASLOptions } from "kafkajs";

export interface KafkaModuleOptions {
    clientId: string;
    brokers: string[];
    retry: RetryOptions;
    connectionTimeout?: number;
    logLevel?: logLevel;
    ssl?: SSLOptions | boolean ;
    sasl?: SASLOptions;
    // authenticationTimeout?: number;
    // reauthenticationThreshold?: number;
    // requestTimeout?: number;
    // enforceRequestTimeout?: boolean;
}

interface SSLOptions {
    rejectUnauthorized: boolean;
    ca: string[];
    cert: string;
    key: string;
}

interface RetryOptions {
    initialRetryTime?: number;
    retries?: number;
}

export interface KafkaModuleAsyncOptions {
    imports?: any[];
    inject?: any[];
    useFactory?: (...args: any[]) => Promise<KafkaModuleOptions> | KafkaModuleOptions;
}