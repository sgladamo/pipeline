FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 81

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

WORKDIR /src
COPY ./SA.Shield.Api SA.Shield.Api/
COPY ./SA.Shield.Capacity SA.Shield.Capacity/
COPY ./SA.Shield.Common SA.Shield.Common/
COPY ./SA.Shield.Core SA.Shield.Core/
COPY ./SA.Shield.Despatch SA.Shield.Despatch/
COPY ./SA.Shield.Operations SA.Shield.Operations/

RUN dotnet restore "SA.Shield.Api/SA.Shield.Api.csproj"
COPY . .
WORKDIR /src/SA.Shield.Api
RUN dotnet build "SA.Shield.Api.csproj" -c Release -o /app/build

FROM build as publish
RUN dotnet publish "SA.Shield.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT [ "dotnet", "SA.Shield.Api.dll" ]