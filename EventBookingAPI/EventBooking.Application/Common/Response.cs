namespace EventBooking.Application.Common;

public class Response<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static Response<T> Succeed(T data, string message = "Operation completed successfully")
    {
        return new Response<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static Response<T> Fail(string message, List<string>? errors = null)
    {
        return new Response<T>
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
}

// Non-generic response for operations that don't return data
public class Response
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public List<string>? Errors { get; set; }

    public static Response Succeed(string message = "Operation completed successfully")
    {
        return new Response
        {
            Success = true,
            Message = message
        };
    }

    public static Response Fail(string message, List<string>? errors = null)
    {
        return new Response
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
} 