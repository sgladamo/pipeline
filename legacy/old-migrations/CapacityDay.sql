USE [SysproCompanyB]
GO

/****** Object:  Table [dbo].[CapacityDay]    Script Date: 05/08/2022 16:32:40 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CapacityDay](
	[CapacityDayId] [varchar](255) NOT NULL,
	[Day] [datetime2](7) NOT NULL,
	[AvailableHours] [float] NOT NULL,
	[HoursUsed] [float] NOT NULL,
	[Cell] [varchar](50) NOT NULL,
	[CapacityJobId] [varchar](255) NULL,
 CONSTRAINT [PK_CapacityDay] PRIMARY KEY CLUSTERED 
(
	[CapacityDayId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[CapacityDay]  WITH CHECK ADD  CONSTRAINT [FK_CapacityDay_CapacityJob] FOREIGN KEY([CapacityJobId])
REFERENCES [dbo].[CapacityJob] ([CapacityJobId])
GO

ALTER TABLE [dbo].[CapacityDay] CHECK CONSTRAINT [FK_CapacityDay_CapacityJob]
GO

