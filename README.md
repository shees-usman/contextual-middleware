### Contextual middleware
Contextual Middleware is a NestJs middleware build to attach a context object to a request/reponse transaction.
This context object can then be accessed from anywhere within the lifecycle of the transation to recall the held values at any time.


## Getting Started
To supercharge your transaction contexts with this library you must perform the following steps.
1. Install the library `npm i contextual-middleware --save`
2. Add the middleware to all requests in `main.ts`
   ```
      export class AppModule implements NestModule {
       configure(consumer: MiddlewareConsumer) {
          consumer
          .apply(
            withContext,
            appendToContext(appendTrackingHeaderToContext),
            LoggerMiddleware
          ).forRoutes({ path: '*', method: RequestMethod.ALL });
        }
      }
   ```
3. Configure the callback to attach custom parameters to the context. The callback takes two arguments context object and a request object and returns nothing.
   An example is the callback which attaches tracking data from headers to context.
   ```
   const appendHeaderToContext = (context, req) => {
     context.customHeaderOne = req.headers['x-custom-header-one'];
     context.customHeaderTwo = req.headers['x-custom-header-two'];
   };
   ```
4. Access the context anywhere in your request life cycle using
   ```
   const context = ctx();
   console.log(context.customHeaderOne);
   ```

## How to contribute:
   Want to contribute? Feel free to create an issue, so we can talk about the issue.
   Then based on that create a pull request if we feel the feature/enhancement should exist.


