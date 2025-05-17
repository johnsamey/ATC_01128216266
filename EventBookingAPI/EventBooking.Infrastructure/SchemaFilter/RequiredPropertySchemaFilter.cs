using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace EventBooking.Infrastructure.SchemaFilter;

public class RequiredPropertySchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (schema.Properties == null)
            return;

        foreach (var property in context.Type.GetProperties())
        {
            var isRequired = property.GetCustomAttributes<RequiredAttribute>(true).Any();
            var propertyName = char.ToLowerInvariant(property.Name[0]) + property.Name.Substring(1);
            
            if (isRequired && schema.Properties.ContainsKey(propertyName))
            {
                if (schema.Required == null)
                    schema.Required = new HashSet<string>();
                
                schema.Required.Add(propertyName);
            }
        }
    }
}