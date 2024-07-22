use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::errors::{ProjectError, TransferError};
use crate::state::{Contribution, Project, Status, User};

pub fn add_contribution(ctx: Context<AddContribution>, amount: u64) -> Result<()> {
    validate_project_status(&ctx.accounts.project)?;
    transfer_funds(&ctx, amount)?;
    update_contribution(&mut ctx.accounts.contribution, &ctx.accounts.user, &mut ctx.accounts.project, amount)?;
    update_project(&mut ctx.accounts.project, amount)?;
    Ok(())
}

fn validate_project_status(project: &Account<Project>) -> Result<()> {
    if project.status != Status::Ongoing {
        return Err(ProjectError::ProjectNotOngoing.into());
    }
    Ok(())
}

fn transfer_funds(ctx: &Context<AddContribution>, amount: u64) -> Result<()> {
    let transfer_instruction = Transfer {
        from: ctx.accounts.wallet_pubkey.to_account_info(),
        to: ctx.accounts.project.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        transfer_instruction
    );
    
    match transfer(cpi_ctx, amount.into()) {
        Ok(_) => Ok(()),
        Err(error) => {
            msg!("Error during the contribution transfer: {:?}", error);
            Err(TransferError::TransferFailed.into())
        }
    }
}

fn update_contribution(
    contribution: &mut Account<Contribution>,
    user: &Account<User>,
    project: &mut Account<Project>,
    amount: u64
) -> Result<()> {
    if contribution.user_pubkey == Pubkey::default() {
        initialize_contribution(contribution, user, project, amount)?;
    } else {
        contribution.amount += amount;
    }
    Ok(())
}

fn initialize_contribution(
    contribution: &mut Account<Contribution>,
    user: &Account<User>,
    project: &mut Account<Project>,
    amount: u64
) -> Result<()> {
    contribution.user_pubkey = *user.to_account_info().key;
    contribution.project_pubkey = *project.to_account_info().key;
    contribution.amount = amount;
    project.contribution_counter += 1;
    Ok(())
}

fn update_project(project: &mut Account<Project>, amount: u64) -> Result<()> {
    project.raised_amount += amount;
    Ok(())
}

#[derive(Accounts)]
#[instruction(amount: u32)]
pub struct AddContribution<'info> {
    #[account(mut, has_one = wallet_pubkey)]
    pub user: Account<'info, User>,

    #[account(mut)]
    pub project: Account<'info, Project>,

    #[account(
        init_if_needed,
        payer = wallet_pubkey,
        space = 8 + Contribution::INIT_SPACE,
        seeds = [b"contribution", project.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub contribution: Account<'info, Contribution>,

    #[account(mut)]
    pub wallet_pubkey: Signer<'info>,

    pub system_program: Program<'info, System>,
}
