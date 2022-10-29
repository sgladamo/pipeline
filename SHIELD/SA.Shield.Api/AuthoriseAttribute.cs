namespace SA.Shield.Api
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using SA.Shield.Core.Activation;

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthoriseAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (!ActivationService.IsActive)
                context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
        }
    }
}
