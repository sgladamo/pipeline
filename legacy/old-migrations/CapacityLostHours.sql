USE [SysproCompanyB]
GO

/****** Object:  Table [dbo].[CapacityLostHours]    Script Date: 30/08/2022 20:03:49 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CapacityLostHours](
	[Date] [datetime2](7) NOT NULL,
	[Quality] [decimal](18, 0) NOT NULL,
	[Other] [decimal](18, 0) NOT NULL,
 CONSTRAINT [PK_CapacityLostHours] PRIMARY KEY CLUSTERED 
(
	[Date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


