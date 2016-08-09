#import "Encrypter.h"
#import <Cordova/CDVPlugin.h>

@implementation Encrypter

- (void)encrypt:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        NSString* message = [command.arguments objectAtIndex:0];
        NSString* client = [command.arguments objectAtIndex:1];

        if (message != nil && [message length] > 0) {
            NSString *result = [self encryptString:message withClient:client];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:result];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        }

        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)decrypt:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        NSString* message = [command.arguments objectAtIndex:0];
        NSString* client = [command.arguments objectAtIndex:1];

        if (message != nil && [message length] > 0) {
            NSString *result = [self decryptString:message withClient:client];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:result];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        }

        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(NSString *)encryptString:(NSString *)message withClient:(NSString *)client
{
    NSData *toencrypt = [message dataUsingEncoding:NSUTF8StringEncoding];

    NSData *key = [client dataUsingEncoding:NSUTF8StringEncoding];

    NSData *iv = [client dataUsingEncoding:NSUTF8StringEncoding];

    CCCryptorStatus status = kCCSuccess;


    CCCryptorRef cryptor = NULL;


    NSMutableData * keyData, * ivData;
    keyData = (NSMutableData *) [key mutableCopy];
    ivData = (NSMutableData *) [iv mutableCopy];


    // ensure correct lengths for key and iv data, based on algorithms
    [self fixKeyLengths:keyData withiVData:ivData];

    status = CCCryptorCreate( kCCEncrypt, kCCAlgorithmAES128, kCCOptionPKCS7Padding,
                             [keyData bytes], [keyData length], [ivData bytes],
                             &cryptor );

    if ( status != kCCSuccess )
    {

        return nil;
    }

    NSData * result = [self _runCryptor: cryptor result: &status data:toencrypt];
    CCCryptorRelease( cryptor );
    if (result == nil )
    {
        return nil;
    }


    NSString *resultString = [result base64EncodedStringWithOptions:0];
    return resultString;
}

- (NSString *) decryptString:(NSString *)message withClient:(NSString *)client
{
    NSData *toencrypt = [[NSData alloc] initWithBase64EncodedString:message
                                                            options:0];

    NSData *key = [client dataUsingEncoding:NSUTF8StringEncoding];

    NSData *iv = [client dataUsingEncoding:NSUTF8StringEncoding];

    CCCryptorStatus status = kCCSuccess;


    CCCryptorRef cryptor = NULL;


    NSMutableData * keyData, * ivData;
    keyData = (NSMutableData *) [key mutableCopy];
    ivData = (NSMutableData *) [iv mutableCopy];


    // ensure correct lengths for key and iv data, based on algorithms
    [self fixKeyLengths:keyData withiVData:ivData];

    status = CCCryptorCreate( kCCDecrypt, kCCAlgorithmAES128, kCCOptionPKCS7Padding,
                             [keyData bytes], [keyData length], [ivData bytes],
                             &cryptor );

    if ( status != kCCSuccess )
    {

        return nil;
    }

    NSData * result = [self _runCryptor: cryptor result: &status data:toencrypt];
    CCCryptorRelease( cryptor );
    if (result == nil )
    {
        return nil;
    }


    NSString *resultString = [[NSString alloc] initWithData:result encoding:NSUTF8StringEncoding];
    return resultString;
}

- (NSData *) _runCryptor: (CCCryptorRef) cryptor result: (CCCryptorStatus *) status data:(NSData *)msg
{
    size_t bufsize = CCCryptorGetOutputLength( cryptor, (size_t)[msg length], true );
    void * buf = malloc( bufsize );
    size_t bufused = 0;
    size_t bytesTotal = 0;
    *status = CCCryptorUpdate( cryptor, [msg bytes], (size_t)[msg length],
                              buf, bufsize, &bufused );
    if ( *status != kCCSuccess )
    {
        free( buf );
        return ( nil );
    }

    bytesTotal += bufused;

    *status = CCCryptorFinal( cryptor, buf + bufused, bufsize - bufused, &bufused );
    if ( *status != kCCSuccess )
    {
        free( buf );
        return ( nil );
    }

    bytesTotal += bufused;

    return ( [NSData dataWithBytesNoCopy: buf length: bytesTotal] );
}


- (void) fixKeyLengths:(NSMutableData * )keyData withiVData:(NSMutableData * )ivData
{
    NSUInteger keyLength = [keyData length];
    if ( keyLength <= 16 )
    {
        [keyData setLength: 16];
    }
    else if ( keyLength <= 24 )
    {
        [keyData setLength: 24];
    }
    else
    {
        [keyData setLength: 32];
    }

    [ivData setLength: [keyData length]];
}


@end
