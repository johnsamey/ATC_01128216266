FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
EXPOSE 80
EXPOSE 443

COPY *.sln .
COPY EventBooking.Domain/*.csproj ./EventBooking.Domain/
COPY EventBooking.Application/*.csproj ./EventBooking.Application/
COPY EventBooking.Infrastructure/*.csproj ./EventBooking.Infrastructure/
COPY EventBooking.API/*.csproj ./EventBooking.API/

RUN dotnet restore EventBooking.sln

COPY . .

WORKDIR /src/EventBooking.API
# publish with release mode 
# /app => publish this release into it 
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app


COPY --from=build /app .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "EventBooking.API.dll"]









































# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS build
# WORKDIR /src

# COPY *.sln .
# COPY ServiceManagmentSystem.Domain/*.csproj ./ServiceManagmentSystem.Domain/
# COPY ServiceManagmentSystem.Application/*.csproj ./ServiceManagmentSystem.Application/
# COPY ServiceManagmentSystem.Infrastructure/*.csproj ./ServiceManagmentSystem.Infrastructure/
# COPY ServiceManagmentSystem.MVC/*.csproj ./ServiceManagmentSystem.MVC/

# RUN dotnet restore ServiceManagmentSystem.sln

# COPY . .

# WORKDIR /src/ServiceManagmentSystem.MVC
# RUN dotnet publish -c Release -o /app

# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS runtime
# WORKDIR /app

# COPY --from=build /app .

# EXPOSE 8080

# ENTRYPOINT ["sh", "-c", "dotnet ServiceManagmentSystem.MVC.dll ef database update && dotnet ServiceManagmentSystem.MVC.dll"]

# ENV ASPNETCORE_URLS=http://+:5678
# EXPOSE 8080
# "dotnet", "ServiceManagmentSystem.MVC.dll"
