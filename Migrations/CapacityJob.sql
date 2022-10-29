USE [SysproCompanyB]
GO

/****** Object:  Table [dbo].[CapacityJob]    Script Date: 05/08/2022 16:33:03 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CapacityJob](
	[CapacityJobId] [varchar](255) NOT NULL,
	[Job] [varchar](50) NOT NULL,
	[TimeUsed] [float] NOT NULL,
	[CapacityDayId] [varchar](255) NOT NULL,
	[StockCode] [varchar](50) NOT NULL,
	[StockDescription] [varchar](255) NOT NULL,
	[Cell] [varchar](50) NOT NULL,
	[Priority] [float] NOT NULL,
	[Qty] [float] NOT NULL,
 CONSTRAINT [PK_CapacityJob] PRIMARY KEY CLUSTERED 
(
	[CapacityJobId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

